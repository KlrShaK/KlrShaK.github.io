---
layout: portfolio
title: Visual SLAM from Scratch
portfolio_slug: simple-slam
description: An educational monocular SLAM framework built for OpenCV and Google Summer of Code.
portfolio: true
---

## Why build another SLAM system?

Production SLAM libraries are powerful, but their tightly coupled internals make them difficult to learn from or modify. My Google Summer of Code project with OpenCV focused on a readable Python implementation whose components can be inspected, swapped, and tested independently.

## The system

The current monocular pipeline performs delayed two-view initialization, frame-to-map tracking, keyframe insertion, triangulation, local bundle adjustment, and live 2D/3D visualization. It supports classical OpenCV features as well as learned **ALIKED + LightGlue** matching, with PyCeres handling nonlinear optimization.

I also added camera-calibration tooling, multiple dataset loaders, geometry-focused tests, and documentation that makes the repository suitable for experimentation rather than treating SLAM as a black box.

## Outcome

The project became a modular teaching and research framework with more than 100 commits and public recognition through OpenCV’s 2025 GSoC program. It remains intentionally experimental—not a production replacement—but exposes the full path from pixels to a tracked camera and sparse map.
