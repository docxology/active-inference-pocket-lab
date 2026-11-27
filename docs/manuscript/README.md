# Pocket Lab technical manuscript

The numbered Markdown sections describe Spin's curriculum, numerical
interactives, browser continuity, and verification. This directory is the
canonical manuscript source. The checked-in diagram has an editable
Graphviz source and a caption and alt-text registry under [assets](assets/).

To regenerate the image, run this command from the repository root.

```bash
dot -Tpng docs/manuscript/assets/learning-continuity.dot -o docs/manuscript/assets/learning-continuity.png
```

## Render and validate

Use a clean source checkout whose physical directory name is `active-inference-pocket-lab`.
Stage 04 uses this directory name to locate the combined PDF. Use a separate copy of the
[pinned template renderer](https://github.com/docxology/template/tree/87704feae0a4490ef7dad9c931d268e8c30273c2).
Install Git, uv, Pandoc, XeLaTeX, and the TeX packages in the template
[setup guide](https://github.com/docxology/template/blob/87704feae0a4490ef7dad9c931d268e8c30273c2/docs/guides/startup-and-setup.md).
The PDF uses the checked-in figure. App tests are documented in
[Testing](../testing.md).

From the root of the Spin checkout, run:

```bash
spin_checkout="$(pwd -P)"
renderer_checkout="$(mktemp -d)/template"
mkdir -p output/figures
cp docs/manuscript/assets/learning-continuity.png docs/manuscript/assets/figure_registry.json output/figures/

git clone https://github.com/docxology/template.git "$renderer_checkout"
git -C "$renderer_checkout" checkout --detach 87704feae0a4490ef7dad9c931d268e8c30273c2
cd "$renderer_checkout"
uv sync --locked
mkdir -p projects/working
ln -s "$spin_checkout" projects/working/active-inference-pocket-lab
uv run --no-sync python scripts/pipeline/stage_03_render.py --project working/active-inference-pocket-lab
uv run --no-sync python scripts/pipeline/stage_04_validate.py --project working/active-inference-pocket-lab
```

In the Spin checkout, inspect `output/pdf/active-inference-pocket-lab_combined.pdf`
for the six sections, resolved bibliography, and continuity diagram.
`output/reports/validation_report.md` records the validation verdict.
`output/reports/rendered_provenance.json` records the source and output bindings.
