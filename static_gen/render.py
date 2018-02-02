import re
import unicodedata
from datetime import datetime as dt

import mistune
from jinja2 import Environment, FileSystemLoader

markdown = mistune.Markdown()


def group_into(l, n=6):
    """
    Partition list into sub-lists of `n` items.
    l: list
    n: number of items in each sublist
    """
    for i in range(0, len(l), n):
        yield l[i:i + n]


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


def setup_jinja():
    # setup templates
    env = Environment(loader=FileSystemLoader('templates'))
    env.filters['datetimeformat'] = datetimeformat
    env.filters['slugify'] = slugify
    env.filters['render_content'] = render_content
    env.filters['blog_link'] = blog_link
    env.filters['header_image'] = header_image
    env.filters['render_text'] = render_text
    env.filters['group_into'] = group_into
    env.filters['md'] = markdown
    return env


def blog_link(post):
    slug = post['path'].replace('.yml', '.html')
    if not slug.startswith('/'):
        slug = '/' + slug
    return slug


def header_image(post):
    return post['thumbnail']


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


def render_text_image_row(value):
    image_ = render_image(value['image'])
    text_ = render_text(value['content'])
    if value['type_'] == 'image_text_row':
        data = {
            'left_col': image_,
            'right_col': text_,
        }
    elif value['type_'] == 'text_image_row':
        data = {
            'left_col': text_,
            'right_col': image_,
        }

    else:
        raise NotImplementedError

    return render_template('blocks/two_column.html', data)


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
        'text_image_row': render_text_image_row,
        'image_text_row': render_text_image_row,
        'raw_html': lambda value: value['html'],
        'text_text_row': render_text_text_row,
        'text_text_row_with_sep': render_text_text_row_with_sep,
        'giving_row': render_giving_row,
        'separator': render_separator,
        'team_list': render_team_list,
        'activities_list': render_activities_list,
        'activity_contact': render_activity_contact,
    }
    try:
        render_fn = render_fns[type_]
    except KeyError:
        raise NotImplementedError(f'{type_} not implemented')

    return render_fn(value)
