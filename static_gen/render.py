import os
import re
import unicodedata
from datetime import datetime as dt
from hashlib import sha256

import mistune
from jinja2 import Environment, FileSystemLoader
from PIL import Image

from .constants import DIST_DIR
from .utils import group_into

markdown = mistune.Markdown()


def datetimeformat(value, format='%H:%M  %d-%b-%Y') -> str:
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
        value = unicodedata.normalize('NFKC', value)
        value = re.sub(r'[^\w\s-]', '', value, flags=re.U).strip().lower()
        return re.sub(r'[-\s]+', '-', value, flags=re.U)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)


def render_maybe_active(href, uri):
    if uri is None:
        return ""
    if uri.startswith(href):
        return "active"
    else:
        return ""


def setup_jinja():
    # setup templates
    env = Environment(loader=FileSystemLoader('templates'))
    env.filters['datetimeformat'] = datetimeformat
    env.filters['slugify'] = slugify
    env.filters['render_content'] = render_content
    env.filters['header_image'] = header_image
    env.filters['render_text'] = render_text
    env.filters['group_into'] = group_into
    env.filters['md'] = markdown
    env.filters['render_image'] = render_image
    env.filters['render_bg_image'] = render_bg_image
    env.globals['maybe_active'] = render_maybe_active
    return env


def header_image(post):
    return render_image(post['thumbnail'])


def render_template(templ, data):
    env = setup_jinja()
    return env.get_template(templ).render(**data)


def render_text(text):
    if text:
        return markdown(text)
    else:
        return ""


def render_tagline(value):
    return render_template('blocks/tagline.html', {'content': value['content']})


def render_image(url):
    return render_template('blocks/simple_image.html', {'url': url})


def render_giving_form():
    return render_template('blocks/giving_form.html', {})


def render_text_text_row(value):
    left = render_text(value['left'])
    right = render_text(value['right'])
    data = {
        'left_col': left,
        'right_col': right,
    }

    return render_template('blocks/two_column.html', data)


def render_text_text_row_with_sep(value):
    return render_separator(None) + render_text_text_row(value)


def render_giving_row(value):
    left = render_giving_form()
    right = render_text(value['right'])
    data = {
        'left_col': left,
        'right_col': right,
    }

    return render_template('blocks/two_column.html', data)


def render_separator(_):
    return render_template('blocks/separator.html', {})


def render_team_list(value):
    return render_template('blocks/team_list.html', value)


def render_activities_list(value):
    return render_template('blocks/activities_list.html', value)


def render_activity_contact(value):
    return render_template('blocks/activity_contact.html', value)


def render_one_wide_row(value):
    return render_template('blocks/one_wide_row.html', value)


def render_content(value) -> str:
    if isinstance(value, list):
        return '\n'.join([render_content(v) for v in value])

    try:
        assert 'type_' in value
    except AssertionError:
        raise AssertionError(f'type_ missing from value: {value}')
    type_ = value['type_']

    render_fns = {
        'tagline': render_tagline,
        'raw_html': lambda value: value['html'],
        'text_text_row': render_text_text_row,
        'text_text_row_with_sep': render_text_text_row_with_sep,
        'giving_row': render_giving_row,
        'separator': render_separator,
        'team_list': render_team_list,
        'activities_list': render_activities_list,
        'activity_contact': render_activity_contact,
        'one_wide_row': render_one_wide_row,
    }
    try:
        render_fn = render_fns[type_]
    except KeyError:
        raise NotImplementedError(f'{type_} not implemented')

    return render_fn(value)


def infer_image_type(src):
    src = src.lower()
    if src.endswith('.png'):
        return 'png'
    if src.endswith('.jpg') or src.endswith('jpeg'):
        return 'jpg'
    if src.endswith('.gif'):
        return 'gif'

    raise NotImplementedError(f'No image type for {src}')


def convert_to_webp(src):
    path_to_src_file = DIST_DIR + src
    out_file_uri, _ = os.path.splitext(src)
    out_file_uri += '.webp'
    path_to_out_file = DIST_DIR + out_file_uri

    im = Image.open(path_to_src_file)
    im.save(path_to_out_file, 'WEBP')

    return out_file_uri


def convert_to_jpeg2000(src):
    path_to_src_file = DIST_DIR + src
    out_file_uri, _ = os.path.splitext(src)
    out_file_uri += '.jp2'
    path_to_out_file = DIST_DIR + out_file_uri

    im = Image.open(path_to_src_file)
    im.save(path_to_out_file, 'JPEG2000')

    return out_file_uri


def resize_images(src):
    sizes = [1920, 1600, 1366, 1024, 768, 640, ]
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
    out_file_uri = f'{out_file_uri}_{sz}{ext}'
    path_to_out_file = DIST_DIR + out_file_uri

    im.thumbnail([sz, height], Image.ANTIALIAS)
    im.save(path_to_out_file)

    return out_file_uri


def render_bg_image(src):
    class_hash = sha256(src.encode()).hexdigest()[:8]
    resized_images = resize_images(src)
    return render_template(
        'blocks/bg_image.html', {
            'src': src,
            'resized_images': resized_images,
            'class_hash': 'h-' + class_hash,
        }
    )


def render_image(src, alt_text='', class_text=''):
    src_webp = convert_to_webp(src)
    src_type = infer_image_type(src)

    return render_template(
        'blocks/picture.html', {
            'src': src,
            'src_type': src_type,
            'alt_text': alt_text,
            'class_text': class_text,
            'src_webp': src_webp,
        }
    )
