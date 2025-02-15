% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/visualizations.R
\name{h9_waterfall_chart}
\alias{h9_waterfall_chart}
\title{Waterfall}
\usage{
h9_waterfall_chart(
  h,
  x = NULL,
  y = NULL,
  fontsize = NULL,
  marginleft = NULL,
  marginbottom = NULL,
  rebind = NULL,
  ...
)
}
\arguments{
\item{h}{A h9 object created by h9_create.}

\item{x}{The column that sets the x coordinates}

\item{y}{A cumalative sum is calculated on this column and then the difference are visualized}

\item{fontsize}{The font size}

\item{marginleft}{The left margin}

\item{marginbottom}{The bottom margin}

\item{rebind}{A list of rebindings to apply to this function parameters.}

\item{...}{Other h9 parameters.}
}
\value{
A list with the pipeline specification.
}
\description{
Lay out cascades of data next to a towering waterfall representing the total
}
