import os

from .constants import *
from .utils import load_yaml, yaml, group_into


def extract_tags(posts):
    tags = [_extract_tags(p) for p in posts]
    # flatten lists:
    tags = [item for sublist in tags for item in sublist]
    return list(set(tags))


def _extract_tags(post):
    tags = [t.strip() for t in post['tags']]
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


def paginate(posts):
    groups = group_into(posts, 5)
    pagination = []
    for idx, g in enumerate(groups):
        if idx == 0:
            prev_link = None
        elif idx == 1:
            prev_link = '/headlines'
        else:
            prev_link = f'/headlines/{idx - 1}.html'

        next_link = f'/headlines/{idx + 1}.html'

        pagination.append(
            {
                'prev': prev_link,
                'next': next_link,
                'posts': g,
            }
        )

    pagination[-1]['next'] = None  # no next for last group

    return pagination


def _write_blog_index(env, idx, data):
    result = env.get_template('headlines.html').render(data)
    if idx == 0:
        path = os.path.join(DIST_DIR, 'headlines.html')
    else:
        path = os.path.join(DIST_DIR, 'headlines', f'{str(idx)}.html')

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(result)


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

    posts = sorted(posts, key=lambda p: p['date'])
    posts = list(reversed(posts))

    tags = extract_tags(posts)
    pagination = paginate(posts)

    # write index:
    for idx, paged_data in enumerate(pagination):
        _write_blog_index(
            env,
            idx,
            {
                'data': {
                    'title': 'Headlines'
                },
                'tags': tags,
                'pagination': paged_data,
            },
        )
