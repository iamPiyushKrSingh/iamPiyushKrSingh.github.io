---
title: "Markdown Test Project $E=mc^2$"
category: "Coding Projects"
icon: "terminal"
tags: ["Test", "Markdown", "Math"]
summary: "A comprehensive test project designed to showcase the new Markdown capabilities including KaTeX math, code blocks, and rich text formatting."
featured: true
order: 1
---

Welcome to the new Markdown-powered projects system! Because we migrated away from JSON, you can now write your project details using standard Markdown formatting.

## 1. Rich Text Formatting

You can easily use **bold**, _italic_, or ~~strikethrough~~ text. You can also organize your thoughts into clean lists:

- Point one
- Point two
  - Nested point

## 2. Advanced Mathematics (KaTeX)

Since this is processed by Astro, you have full access to complex LaTeX equations right inside your project descriptions!

For example, the Schrödinger equation:

$$
i\hbar\frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \left [ \frac{-\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t)\right ] \Psi(\mathbf{r},t)
$$

Or an inline equation like $\oint \vec{E} \cdot d\vec{A} = \frac{q_{enc}}{\varepsilon_0}$.

## 3. Code Blocks with Syntax Highlighting

You can include code snippets that will automatically receive syntax highlighting:

```python title="hehe.py"
def calculate_entropy(probabilities):
    """Calculates the Shannon entropy of a probability distribution."""
    import numpy as np
    return -np.sum(probabilities * np.log2(probabilities))

print(calculate_entropy([0.5, 0.5])) # Output: 1.0
```

## 4. Tables and Links

Need to compare data? Just drop in a markdown table:

| Framework | Language | Speed  |
| --------- | -------- | ------ |
| Astro     | JS/TS    | 🚀🚀🚀 |
| Django    | Python   | 🚀🚀   |
| Rails     | Ruby     | 🚀     |

And of course, you can easily add [links to external resources](https://astro.build) or embed images seamlessly!
