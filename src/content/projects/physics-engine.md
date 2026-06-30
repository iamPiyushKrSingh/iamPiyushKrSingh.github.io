---
title: "Physics Engine v2.0"
category: "Coding Projects"
icon: "box"
tags: ["C++", "OpenGL", "Simulation"]
summary: "A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations.A rigid-body physics engine built from scratch for 3D simulations."
---

Built entirely in C++ with OpenGL for rendering, this engine handles complex collisions, gravity, and momentum transfer in real-time. The architecture uses a highly optimized Entity-Component-System (ECS) to ensure cache locality.

It features a custom-built broad-phase collision detection system using spatial hashing, capable of running thousands of simultaneous interactions at 60fps.

![Circuit Board](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop)

The physics solver utilizes a sequential impulse approach. You can read more about the underlying mathematics in the [Rigid Body Dynamics](https://en.wikipedia.org/wiki/Rigid_body_dynamics) documentation.

Future updates will include soft-body physics and a custom fluid dynamics solver based on Position Based Dynamics (PBD).
