##
## output: [ 'stdout', 'data', 'model' ]
## params:
##  - name: x
##    label: x
##  - name: y
##    label: y
##    single: true
## environment: worker
## cache: true
## 

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import statsmodels.api as sm
from statsmodels.regression import linear_model
import json

data = pd.DataFrame(data)

if x and y:
  if isinstance(x, str):
    x = [x]
  if not isinstance(y, str):
    y = y.to_py()
  x_train = data[x]
  y_train = data[y]
  lm = LinearRegression()
  lm.fit(x_train, y_train)
  model = lm
  x_train = sm.add_constant(x_train)
  lm_model = linear_model.OLS(y_train, x_train).fit()

  print(lm_model.summary())
