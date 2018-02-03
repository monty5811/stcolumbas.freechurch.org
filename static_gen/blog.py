import os

from .constants import *
from .utils import load_yaml, yaml


def extract_tags(posts):
    tags = [_extract_tags(p) for p in posts]
    # flatten lists:
    tags = [item for sublist in tags for item in sublist]
    return list(set(tags))


def _extract_tags(post):
    tags = post['tags'].split(',')
    tags = [t.strip() for t in tags]
    return tags

def load_post(fname):
    with open(fname, 'r') as f:
        d = f.read()
    parts = d.split('\n---\n')
    assert parts[0].startswith('---')
    assert len(parts) == 2
    raw_frontmatter = parts[0]
    body = parts[1]

    frontmatter = yaml.load(raw_frontmatter)
    frontmatter['body'] = body

    return frontmatter


def write_blog_index(env, files):
    """
    Each post has already been written to the dist folder.

    So, here, we just need to build the paginated index and the tags pages.
    """
    posts = []
    for f in files:
        post = load_post(f)
        post['path'] = f.replace(SRC_DIR, '')
        posts.append(post)

    posts = sorted(posts, key=lambda p:p['date'])
    posts = list(reversed(posts))

    tags = extract_tags(posts)

    result = env.get_template('headlines.html').render(
        {
            'posts': posts,
            'data': {'title': 'Headlines'},
            'tags': tags,
        }
    )

    path = os.path.join(DIST_DIR, 'headlines.html')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(result)
