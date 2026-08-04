---
layout: portfolio
title: Vision-Language-Action Cloth Folding
portfolio_slug: cloth-folding
description: SmolVLA policies trained and deployed on a real SO-101 robot arm.
portfolio: true
---

## Learning a deformable task

Cloth folding is deceptively difficult: the object has no fixed shape, small grasping errors compound, and demonstrations must align visual observations with precise robot actions. We built the complete learning loop instead of treating policy training as an isolated step.

## End-to-end pipeline

The workspace covers leader–follower teleoperation, synchronized top and wrist cameras, LeRobot-format demonstration recording, SmolVLA fine-tuning, and local or remote real-time inference. I trained both wrist-only and dual-camera policies for 50,000 steps on an NVIDIA L40S.

The runtime supports a client–server mode that leaves robot control beside the hardware while moving policy inference to a GPU machine. Calibration, port detection, safe start poses, and camera locking are documented as first-class parts of the system.

## Open artifacts

The code, two-camera dataset, trained policies, reference logs, and real-world rollout videos are public so the result can be inspected and reproduced beyond the final demo.
