% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/charts.R
\name{h9_sankey_chart}
\alias{h9_sankey_chart}
\title{Sankey}
\usage{
h9_sankey_chart(
  h,
  source = NULL,
  target = NULL,
  value = NULL,
  palette = NULL,
  fontsize = NULL,
  marginleft = NULL,
  marginbottom = NULL,
  rebind = NULL,
  ...
)
}
\arguments{
\item{h}{A h9 object created by h9_create.}

\item{source}{The column containing the source nodes}

\item{target}{The column containing the target nodes}

\item{value}{The column containing the volume of each arrow}

\item{palette}{Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.}

\item{fontsize}{The font size in pixels}

\item{marginleft}{The margin on the left}

\item{marginbottom}{The margin on the bottom}

\item{rebind}{A list of rebindings to apply to this function parameters.}

\item{...}{Other h9 parameters.}
}
\value{
A list with the pipeline specification.
}
\description{
Show the flow with Captain Sankey's signature diagram
}
