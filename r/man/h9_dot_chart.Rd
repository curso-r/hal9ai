% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/charts.R
\name{h9_dot_chart}
\alias{h9_dot_chart}
\title{Dot Plot}
\usage{
h9_dot_chart(
  h,
  x = NULL,
  color = NULL,
  palette = NULL,
  dotsize = NULL,
  ticks = NULL,
  fontsize = NULL,
  marginleft = NULL,
  marginbottom = NULL,
  rebind = NULL,
  ...
)
}
\arguments{
\item{h}{A h9 object created by h9_create.}

\item{x}{The column in the dataframe whose values should determine the position of the dots along the x-axis}

\item{color}{The column in the dataframe who's values should determine the color of each dot}

\item{palette}{the D3 Palette to determine the color scheme to use}

\item{dotsize}{the size of each dot}

\item{ticks}{The number of ticks on the x-axis}

\item{fontsize}{the size of the font in pixels}

\item{marginleft}{the left margin}

\item{marginbottom}{the bottom margin}

\item{rebind}{A list of rebindings to apply to this function parameters.}

\item{...}{Other h9 parameters.}
}
\value{
A list with the pipeline specification.
}
\description{
Stack data into columns of dots
}
