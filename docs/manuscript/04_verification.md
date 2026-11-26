# Verification and limits

The release gate runs lint, the unit and integration suite, and a
production build. The browser suite uses the preview output to exercise
the module streams and their retrieval questions at mobile and desktop
viewport sizes. Its scenarios also verify that learning state survives
reload, that an unopened module loads offline after installation, and
that an update can retain access to a retired chunk [@spin-source].

The checks establish how the software behaves in the tested environments.
The repository does not contain an evaluation of learner outcomes or a
study of retention across streams. Automated browser accessibility checks
cover the configured rules. Assistive-technology and physical-device
behavior require separate verification.
