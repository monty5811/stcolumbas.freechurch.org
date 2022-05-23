import os
import re
import shutil
import unicodedata
from datetime import datetime as dt
from hashlib import sha256

from jinja2 import Environment, FileSystemLoader

import mistune
from PIL import Image

from .constants import CACHE_DIR, DIST_DIR
from .utils import group_into

markdown = mistune.Markdown()


def md(text):
    return f'<div class="prose">{markdown(text)}</div>'


def datetimeformat(value, format="%H:%M  %d-%b-%Y") -> str:
    return value.strftime(format)


def slugify(value, allow_unicode=False):
    """
    Taken from Django.

    Convert to ASCII if 'allow_unicode' is False. Convert spaces to hyphens.
    Remove characters that aren't alphanumerics, underscores, or hyphens.
    Convert to lowercase. Also strip leading and trailing whitespace.
    """
    value = value.replace("&#039;", "'")
    if allow_unicode:
        value = unicodedata.normalize("NFKC", value)
        value = re.sub(r"[^\w\s-]", "", value, flags=re.U).strip().lower()
        return re.sub(r"[-\s]+", "-", value, flags=re.U)
    value = (
        unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    )
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s]+", "-", value)


def render_maybe_active(href, uri):
    if uri is None:
        return ""
    if uri.startswith(href):
        return "active"
    else:
        return ""


def static(uri):
    path = os.path.join(DIST_DIR, uri.lstrip("/"))
    with open(path, "rb") as f:
        hash = sha256(f.read()).hexdigest()[:8]

    s, e = os.path.splitext(uri)
    new_uri = f"{s}.{hash}{e}"

    new_path = os.path.join(DIST_DIR, new_uri.lstrip("/"))

    shutil.copyfile(path, new_path)

    return new_uri


def image_width(src):
    path_to_src_file = DIST_DIR + src
    im = Image.open(path_to_src_file)
    width, height = im.size
    return width


def image_height(src):
    path_to_src_file = DIST_DIR + src
    im = Image.open(path_to_src_file)
    width, height = im.size
    return height


def header_image(post):
    return render_image(post["thumbnail"])


def render_template(templ, data):
    return env.get_template(templ).render(**data)


def render_text(text):
    if text:
        rendered = markdown(text)
        return process_img_tags(rendered)
    else:
        return ""


def process_img_tags(html):
    tag_re = r'<img\s+[^>]*src="[^"]*"[^>]*>'
    matches = re.findall(tag_re, html)
    for match in matches:
        html = replace_img(html, match)
    return html


def replace_img(html, old_block):
    src = re.findall('src="([^"]*)"', old_block)
    if len(src) > 1:
        raise Exception("Parse error")
    src = src[0]
    new_block = render_template("blocks/simple_image.html", {"url": src})
    html = html.replace(old_block, new_block)
    return html


def render_tagline(value):
    return render_template("blocks/tagline.html", {"content": value["content"]})


def render_image(url):
    return render_template("blocks/simple_image.html", {"url": url})


def render_giving_form(cancelled=False, show_give_to_specific=False):
    return render_template(
        "blocks/giving_form.html",
        {"cancelled": cancelled, "show_give_to_specific": show_give_to_specific},
    )


def render_text_text_row(value):
    left = render_text(value["left"])
    right = render_text(value["right"])
    data = {"left_col": left, "right_col": right}

    return render_template("blocks/two_column.html", data)


def render_text_text_row_with_sep(value):
    return render_separator(None) + render_text_text_row(value)


def render_giving_row(value):
    left = render_giving_form(
        cancelled=value["left"].get("cancelled", False),
        show_give_to_specific=value["left"].get("show_give_to_specific", False),
    )
    right = render_text(value["right"])
    data = {"left_col": left, "right_col": right}

    return render_template("blocks/two_column.html", data)


def render_separator(_):
    return render_template("blocks/separator.html", {})


def render_team_list(value):
    return render_template("blocks/team_list.html", value)


def render_activities_list(value):
    if value["group_into"] > 3:
        raise NotImplementedError("Group into must be less than 4")
    return render_template("blocks/activities_list.html", value)


def render_activity_contact(value, subject):
    value["subject"] = subject
    return render_template("blocks/activity_contact.html", value)


def render_one_wide_row(value):
    return render_template("blocks/one_wide_row.html", value)


def add_num_text_to_str(content, prefix=""):
    return f"{prefix}{content}"


def add_num_text_to_sections(sections, prefix=None):
    num = 1  # start numbering at 1
    for section in sections:
        if prefix is None:
            section["num_text"] = f"{num}."
        else:
            section["num_text"] = f"{prefix}{num}"

        sub_num = 1
        content = []
        for c in section["content"]:
            content.append(
                add_num_text_to_str(c, prefix=f"{section['num_text']}{sub_num}. ")
            )
            sub_num += 1  # increment sub level number

        section["content"] = content
        num += 1  # increment top level number
    return sections


def render_numbered_sections(value):
    value["sections"] = add_num_text_to_sections(value["sections"])
    return render_template("blocks/numbered_sections.html", value)


def render_raw_template(value):
    template_string = value.pop("template")
    template = env.from_string(template_string)
    return template.render(**value)


def render_content(value, *args) -> str:
    if isinstance(value, list):
        return "\n".join([render_content(v) for v in value])

    try:
        assert "type_" in value
    except AssertionError:
        raise AssertionError(f"type_ missing from value: {value}")
    type_ = value["type_"]

    render_fns = {
        "tagline": render_tagline,
        "raw_html": lambda value: value["html"],
        "raw_template": render_raw_template,
        "text_text_row": render_text_text_row,
        "text_text_row_with_sep": render_text_text_row_with_sep,
        "giving_row": render_giving_row,
        "separator": render_separator,
        "team_list": render_team_list,
        "activities_list": render_activities_list,
        "activity_contact": render_activity_contact,
        "one_wide_row": render_one_wide_row,
        "numbered_sections": render_numbered_sections,
    }
    try:
        render_fn = render_fns[type_]
    except KeyError:
        raise NotImplementedError(f"{type_} not implemented")

    return render_fn(value, *args)


def infer_image_type(src):
    src = src.lower()
    if src.endswith(".png"):
        return "png"
    if src.endswith(".jpg") or src.endswith("jpeg"):
        return "jpg"
    if src.endswith(".gif"):
        return "gif"
    if src.endswith(".svg"):
        return "svg"

    raise NotImplementedError(f"No image type for {src}")


def convert_to_webp(src):
    if src.endswith(".svg"):
        return
    # get paths:
    path_to_src_file = DIST_DIR + src
    out_file_uri, _ = os.path.splitext(src)
    out_file_uri = out_file_uri + ".webp"
    path_to_webp_file = DIST_DIR + out_file_uri
    # generate cache path:
    with open(path_to_src_file, "rb") as f:
        src_hash = sha256(f.read()).hexdigest()[:8]

    path_to_cached_file = CACHE_DIR + out_file_uri + f".{src_hash}"
    try:
        # copy from cache
        shutil.copy(path_to_cached_file, path_to_webp_file)
    except Exception:
        # generate & cache
        print(f"Converting {src} to webp")
        im = Image.open(path_to_src_file)
        im.save(path_to_webp_file, "WEBP")
        os.makedirs(os.path.dirname(path_to_cached_file), exist_ok=True)
        shutil.copy(path_to_webp_file, path_to_cached_file)

    return out_file_uri


def resize_images(src):
    sizes = [1920, 1600, 1366, 1024, 768, 640]
    images = {sz: resize_image(src, sz) for sz in sizes}
    return images


def resize_image(src, sz):
    path_to_src_file = DIST_DIR + src
    im = Image.open(path_to_src_file)
    width, height = im.size
    if sz >= height:
        # don't make image any bigger
        return None

    out_file_uri, ext = os.path.splitext(src)
    out_file_uri = f"{out_file_uri}_{sz}{ext}"
    path_to_out_file = DIST_DIR + out_file_uri

    im.thumbnail([sz, height], Image.ANTIALIAS)
    im.save(path_to_out_file)

    return out_file_uri


def render_bg_image_style(src):
    class_hash = sha256(src.encode()).hexdigest()[:8]
    resized_images = resize_images(src)
    return render_template(
        "blocks/bg_image.html",
        {"src": src, "resized_images": resized_images, "class_hash": "h-" + class_hash},
    )


def render_bg_image_class(src):
    class_hash = sha256(src.encode()).hexdigest()[:8]
    return f"h-{class_hash}"


def rewrite_image_path_with_content_hash(src):
    path_to_src_file = DIST_DIR + src
    # generate cache path:
    with open(path_to_src_file, "rb") as f:
        src_hash = sha256(f.read()).hexdigest()[:8]

    s, e = os.path.splitext(src)
    new_uri = f"{s}.{src_hash}{e}"

    path_to_new_file = DIST_DIR + new_uri
    shutil.copy(path_to_src_file, path_to_new_file)
    return new_uri


def render_image(src, alt_text="", class_text=""):
    if src.startswith("https://"):
        return render_template(
            "blocks/picture.html",
            {
                "src": src,
                "src_type": None,
                "alt_text": None,
                "class_text": None,
                "src_webp": None,
            },
        )

    if src.endswith(".svg"):
        with open(DIST_DIR + src, "r") as f:
            return render_template(
                "blocks/picture_svg.html",
                {"svg": f.read(), "alt_text": alt_text, "class_text": class_text,},
            )

    src_webp = convert_to_webp(src)
    src_type = infer_image_type(src)

    src = rewrite_image_path_with_content_hash(src)
    src_webp = (
        rewrite_image_path_with_content_hash(src_webp) if src_webp is not None else None
    )
    return render_template(
        "blocks/picture.html",
        {
            "src": src,
            "src_type": src_type,
            "alt_text": alt_text,
            "class_text": class_text,
            "src_webp": src_webp,
        },
    )


def setup_jinja():
    # setup templates
    env = Environment(loader=FileSystemLoader("templates"))
    env.filters["static"] = static
    env.filters["datetimeformat"] = datetimeformat
    env.filters["slugify"] = slugify
    env.filters["render_content"] = render_content
    env.filters["header_image"] = header_image
    env.filters["render_text"] = render_text
    env.filters["group_into"] = group_into
    env.filters["md"] = md
    env.filters["render_image"] = render_image
    env.filters["render_bg_image_style"] = render_bg_image_style
    env.filters["render_bg_image_class"] = render_bg_image_class
    env.filters["width"] = image_width
    env.filters["height"] = image_height
    env.globals["maybe_active"] = render_maybe_active
    env.globals["is_netlify_build"] = os.environ.get("NETLIFY", None)
    return env


env = setup_jinja()
