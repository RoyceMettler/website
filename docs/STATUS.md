# Status

## Checkpoint: `checkpoint-pre-experiment` (2026-11-11)

The stable version of the site, saved as a fallback before a big experimental
change. If the experiment doesn't work out, this tag is the version to return to.

- **What it is:** an annotated tag on `main`, at the commit where these two
  pull requests were merged:
  - [#1](https://github.com/RoyceMettler/website/pull/1): About montage loading fix.
  - [#2](https://github.com/RoyceMettler/website/pull/2): page transitions, the
    carousel work (performance, drag hint, saved position), and the phone layout.
- **Not deployed:** `npm run deploy` was not run for this version, so the live
  site is unchanged.
- **To look at it:** `git switch --detach checkpoint-pre-experiment`
- **To start work from it:** `git switch -c <new-branch> checkpoint-pre-experiment`
