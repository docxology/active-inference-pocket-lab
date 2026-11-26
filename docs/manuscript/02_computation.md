# Numerical interactives

The Gaussian helper models beliefs through means and precisions. Combining
independent Gaussian factors adds the precisions and weights the factor
means by their precision. Stream interactions use this arithmetic to show
how prior confidence and observation confidence affect the posterior.
Separate helpers compute Gaussian variational free energy and a categorical
expected free-energy step [@spin-source; @parr2022].

The tests exercise the numerical functions directly. For the Gaussian
model they compare free energy with the sum of negative log evidence
and the divergence from the exact posterior. A test also checks behavior
on invalid precision. Equation checks parse authored JSX math strings with
KaTeX. These checks address the implemented examples and their presentation.
