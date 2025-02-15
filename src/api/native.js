import * as environment from '../core/utils/environment';
import * as workers from '../core/workers';
import * as pipelines from '../core/pipelines';
import * as pipelineremote from '../core/pipelineremote';
import * as datasets from '../core/datasets';
import * as screenshot from '../core/utils/screenshot';
import * as htmloutput from '../core/htmloutput';
import * as layout from '../core/layout';
import * as exportto from '../core/exportto';

const runRemote = async (lambda, context) => {
  if (typeof(lambda) != 'function') {
    throw new 'The "run" function expecta a lambda function as parameter';
  }

  const server = environment.getServerUrl();
  const workerUrl = await workers.getValidWorkerUrl();

  var res = await fetch(workerUrl + '/execute', {
    method: 'POST',
    body: JSON.stringify({ operation: 'runlambda', lambda: lambda.toString(), context: context ? context : {} }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    var details = res.statusText;
    try {
      details = await res.json();
    }
    catch (e) {}
    throw 'Failed to execute lambda on remote worker: ' + details;
  }

  return await res.json();
};

export const runPipeline = async (pipelineid, context) => {
  if (!context) context = {};
  var updated = await pipelines.run(
    pipelineid,
    Object.assign(context, {
      html: context.html ? context.html : function(step) {
        return step.html ? document.getElementById(step.html) : undefined;
      }
    }),
    function(pipeline, step, result, error, details) {
    }
  );

  var error = pipelines.getError(updated);
  if (error) throw(error);
}

const runSteps = async (steps, context) => {
  var pipeline = pipelines.create(steps);
  return runPipeline(pipeline, context);
}

export function create(steps) {
  return pipelines.create(steps);
}

export async function run(pipeline, context) {
  var type = typeof(pipeline);
  if (Array.isArray(pipeline)) type = 'array';

  var dispatch = {
    'function': runRemote,
    'array': runSteps,
    'string': pipelineremote.runPipelineRemote,
    'number': runPipeline,
  }

  await dispatch[type](pipeline, context);
};

var maxStepId = 0;
export function step(url, params, output, options) {
  let step = {
    id: maxStepId++,
    html: output,
    options: options
  };

  if (!url && params.script) {
    step.inlineScript = params.script;
    step.inlineScriptLanguage = params.language ?? 'javascript';
  } else {
    // convert param values to pipeline params
    Object.keys(params).forEach(e => {
      var val = params[e];
      var valArray =  Array.isArray(val) ? val : [ val ];
      var valEntries = valArray.map(e => ({ value: e }));
      params[e] = { value: valEntries, name: e };
    });
    step.url = url;
    step.params = params;
  }

  return step;
};

export async function load(raw) {
  const pipeline = typeof(raw) === 'string' ? JSON.parse(decodeURIComponent(escape(atob(raw)))) : raw;
  return await pipelines.load(pipeline);
}

export async function fetchPipeline(pipelinepath) {
  const user = pipelinepath.split('/')[0];
  const pipelinename = pipelinepath.split('/')[1];
  const serverurl = environment.getServerCachedUrl();
  const pipelineInfo = `${serverurl}/api/users/${user}/pipelines/${pipelinename}`;

  var serverId = environment.getId();
  let s3Name = (serverId == 'dev' ? 'devel' : serverId) + 'hal9';

  const infoResp = await fetch(pipelineInfo, {
  });

  const infoData = await infoResp.json();

  const filename = infoData.filename;
  const downloadUrl = `https://${s3Name}.s3.us-west-2.amazonaws.com/pipeline/${filename}.pln`;

  const pipelineResp = await fetch(downloadUrl, {
  });

  return JSON.parse(await pipelineResp.json());
}

export async function setEnv(env) {
}

export async function datasetsSave(dataurl) {
  return datasets.save(dataurl);
}

export async function exporttoGetSaveText(pipelineid, padding, alsoSkip) {
  return await exportto.getSaveText(pipelineid, padding, alsoSkip);
}

export async function exporttoGetHtml(pipelineid) {
  return await exportto.getHtml(pipelineid);
}

export async function exporttoGetHtmlRemote(pipelinepath) {
  return await exportto.getHtmlRemote(pipelinepath);
}

export async function exporttoGetPythonScript(pipelineid) {
  return await exportto.getPythonScript(pipelineid);
}

export async function exporttoGetRScript(pipelineid) {
  return await exportto.getRScript(pipelineid);
}

export async function pipelinesCreate(steps) {
  return await pipelines.create(steps);
}

export async function pipelinesUpdate(pipelineid, steps) {
  return await pipelines.update(pipelineid, steps);
}

export async function pipelinesRemove(pipelineid) {
  return await pipelines.remove(pipelineid);
}

export async function pipelinesRunStep(pipelineid, sid, context, partial) {
  return await pipelines.runStep(pipelineid, sid, context, partial);
}

export async function pipelinesRun(pipelineid, context, partial, stepstopid) {
  return await pipelines.run(pipelineid, context, partial, stepstopid);
}

export async function pipelinesGetError(pipelineid) {
  return await pipelines.getError(pipelineid);
}

export async function pipelinesGetParams(pipelineid, sid) {
  return await pipelines.getParams(pipelineid, sid);
}

export async function pipelinesSetParams(pipelineid, sid, params) {
  return await pipelines.setParams(pipelineid, sid, params);
}

export async function pipelinesMergeParams(pipelineid, sid, params) {
  return await pipelines.mergeParams(pipelineid, sid, params);
}

export async function pipelinesGetSteps(pipelineid) {
  return await pipelines.getSteps(pipelineid);
}

export async function pipelinesUpdateStep(pipelineid, step) {
  return await pipelines.updateStep(pipelineid, step);
}

export async function pipelinesAddStep(pipelineid, step) {
  return await pipelines.addStep(pipelineid, step);
}

export async function pipelinesRemoveStep(pipelineid, step) {
  return await pipelines.removeStep(pipelineid, step);
}

export async function pipelinesMoveStep(pipelineid, stepid, change) {
  return await pipelines.moveStep(pipelineid, stepid, change);
}

export async function pipelinesGetNested(pipelineid) {
  return await pipelines.getNested(pipelineid);
}

export async function pipelinesGetStep(pipelineid, sid) {
  return await pipelines.getStep(pipelineid, sid);
}

export async function pipelinesGetRebindablesForStep(pipelineid, step) {
  return await pipelines.getRebindablesForStep(pipelineid, step);
}

export async function pipelinesGetSources(pipelineid, sid) {
  return await pipelines.getSources(pipelineid, sid);
}

export async function pipelinesGetStepError(pipelineid, sid) {
  return await pipelines.getStepError(pipelineid, sid);
}

export async function pipelinesSetScript(pipelineid, sid, script) {
  return await pipelines.setScript(pipelineid, sid, script);
}

export async function pipelinesGetScript(pipelineid, sid) {
  return await pipelines.getScript(pipelineid, sid);
}

export async function pipelinesGetHashable(pipelineid) {
  return await pipelines.getHashable(pipelineid);
}

export async function pipelinesLoad(pipeline) {
  return await pipelines.load(pipeline);
}

export async function pipelinesGetMaxId(pipelineid) {
  return await pipelines.getMaxId(pipelineid);
}

export async function pipelinesGetGlobal(pipelineid, name) {
  return await pipelines.getGlobal(pipelineid, name);
}

export async function pipelinesSetGlobal(pipelineid, name, data) {
  return await pipelines.setGlobal(pipelineid, name, data);
}

export async function pipelinesGetGlobalNames(pipelineid) {
  return await pipelines.getGlobalNames(pipelineid);
}

export async function pipelinesGetGlobals(pipelineid) {
  return await pipelines.getGlobals(pipelineid);
}

export async function pipelinesInvalidateStep(pipelineid, sid) {
  return await pipelines.invalidateStep(pipelineid, sid);
}

export async function pipelinesSetMetadataProperty(pipelineid, name, value) {
  return await pipelines.setMetadataProperty(pipelineid, name, value);
}

export async function pipelinesGetMetadata(pipelineid) {
  return await pipelines.getMetadata(pipelineid);
}

export async function pipelinesSetAppProperty(pipelineid, name, value) {
  return await pipelines.setAppProperty(pipelineid, name, value);
}

export async function pipelinesGetApp(pipelineid) {
  return await pipelines.getApp(pipelineid);
}

export async function pipelinesAbort(pipelineid) {
  return await pipelines.abort(pipelineid);
}

export async function pipelinesIsAborted(pipelineid) {
  return await pipelines.isAborted(pipelineid);
}

export async function screenshotCapture(output, options = {}) {
  return await screenshot.capture(output, options);
}

export async function screenshotResize(sourceImageData, width, height) {
  return await screenshot.resize(sourceImageData, width, height);
}

export function htmloutputSetIframeStyle(name, value) {
  // only for iframe
}

export async function htmloutputGetScrollWidth() {
  return htmloutput.getScrollWidth();
}

export async function htmloutputGetScrollLeft() {
  return htmloutput.getScrollLeft();
}

export async function htmloutputSetScrollLeft(pixels) {
  htmloutput.setScrollLeft(pixels);
}

export async function htmloutputGetScrollHeight() {
  return htmloutput.getScrollHeight();
}

export async function htmloutputGetScrollTop() {
  return htmloutput.getScrollTop();
}

export async function htmloutputSetScrollTop(pixels) {
  htmloutput.setScrollTop(pixels);
}

export async function layoutRegenerateForDocumentView(pipelineid, removeOldLayout) {
  return await layout.regenerateForDocumentView(pipelineid, removeOldLayout);
}

export async function layoutStoreAppStepLayouts(pipelineid) {
  return layout.storeAppStepLayouts(pipelineid);
}

export async function layoutApplyStepLayoutsToApp(stepLayouts) {
  return layout.applyStepLayoutsToApp(stepLayouts);
}

export async function layoutSetHal9StepOverflowProperty(overflowValue) {
  return layout.setHal9StepOverflowProperty(overflowValue);
}
