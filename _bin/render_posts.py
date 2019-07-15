#!/usr/bin/env python3

import glob
import markdown
import os
import yaml

import jinja2 as j2

POST_OUTDIR = "public/posts"

TEMPLATE_INDIR = "_templates"
POST_INDIR = "_posts"

CONFIG_FILE = "_config.yaml"
TEMPLATE_FILE = "post.html.j2"

WPM_SPEED = 200


def _parse_title(file):
    return " ".join(post.title() for post in file[:-3].split("-"))


def _calulate_wpm(content):
    wpm = len(content.split()) // WPM_SPEED
    return "< 1min" if wpm == 0 else "%d min" % wpm


def render():
    with open(CONFIG_FILE, "r") as f:
        config = yaml.load(f)

    try:
        os.makedirs(POST_OUTDIR)
    except OSError:
        if not os.path.isdir(POST_OUTDIR):
            raise

    markdown_files = glob.glob(os.path.join(POST_INDIR, "*"))
    for file in markdown_files:
        with open("%s/%s" % (POST_INDIR, file), "r") as f:
            content = f.read()

        title = _parse_title(file)

        md = markdown.markdown(content, extensions=["codehilite"])

        loader = j2.FileSystemLoader(searchpath=TEMPLATE_INDIR)
        env = j2.Environment(loader=loader, lstrip_blocks=True, trim_blocks=True)
        template = env.get_template(TEMPLATE_FILE)
        output = template.render(title=title, content=md, **config)

        html_filename = os.path.splitext(file)[0] + ".html"
        with open("%s/%s" % (POST_OUTDIR, html_filename), "w") as f:
            f.write(output)


if __name__ == "__main__":
    render()
