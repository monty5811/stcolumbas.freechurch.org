import codecs
import datetime
import os

from .constants import *
from .feed import write_feed
from .utils import group_into, load_yaml, yaml


def generate_post_path(orig_path):
    # extract only the filename
    fname = os.path.basename(orig_path)
    # pull out the date, assuming: yyyy-mm-dd-title.md
    year, month, day, *rest = fname.split("-")
    # reassemble slug
    slug = "-".join(rest)
    slug = slug.replace(".md", "")
    # assemble new path
    new_path = os.path.join("updates", year, month, day, slug)

    return new_path


def write_post(env, post):
    result = env.get_template(post["layout"] + ".html").render(
        data=post, content=post, uri=post["path"]
    )
    new_path = os.path.join(DIST_DIR, post["path"] + ".html")
    os.makedirs(os.path.dirname(new_path), exist_ok=True)
    print(new_path)
    with open(new_path, "w") as f:
        f.write(result)


def load_post(fname):
    with codecs.open(fname, encoding="utf-8", mode="r") as f:
        d = f.read()
    d = d.replace("\r\n", "\n")
    parts = d.split("\n---\n")
    assert parts[0].startswith("---")
    assert len(parts) == 2
    raw_frontmatter = parts[0]
    body = parts[1]

    frontmatter = yaml.load(raw_frontmatter, Loader=yaml.FullLoader)
    frontmatter["body"] = body

    # change datetimes to date:
    if isinstance(frontmatter["date"], datetime.datetime):
        frontmatter["date"] = frontmatter["date"].date()

    return frontmatter


def paginate(posts, prefix="updates"):
    groups = group_into(posts, 5)
    pagination = []
    for idx, g in enumerate(groups):
        if idx == 0:
            prev_link = None
        elif idx == 1:
            prev_link = f"/{prefix}"
        else:
            prev_link = f"/{prefix}/{idx - 1}.html"

        next_link = f"/{prefix}/{idx + 1}.html"

        pagination.append({"prev": prev_link, "next": next_link, "posts": g})

    pagination[-1]["next"] = None  # no next for last group

    return pagination


def _write_blog_index(env, idx, data, tag_page=False, tag=None):
    if idx == 0:
        if tag_page:
            path = os.path.join(DIST_DIR, "updates", "tags", f"{tag}.html")
        else:
            path = os.path.join(DIST_DIR, "updates.html")
    else:
        if tag_page:
            path = os.path.join(DIST_DIR, "updates", "tags", tag, f"{str(idx)}.html")
        else:
            path = os.path.join(DIST_DIR, "updates", f"{str(idx)}.html")

    data["uri"] = path.replace(DIST_DIR, "").replace(".html", "")
    data["tag"] = tag
    result = env.get_template("updates.html").render(data)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(path)
    with open(path, "w") as f:
        f.write(result)


def write_blog_index(env, files):
    """"""
    posts = []
    for f in files:
        post = load_post(f)
        post["path"] = generate_post_path(f)
        posts.append(post)
        write_post(env, post)

    posts = sorted(posts, key=lambda p: p["date"])
    posts = list(reversed(posts))

    pagination = paginate(posts)

    # write index:
    for idx, paged_data in enumerate(pagination):
        _write_blog_index(
            env, idx, {"data": {"title": "Updates"}, "pagination": paged_data},
        )

    # write rss:
    write_feed(posts)
