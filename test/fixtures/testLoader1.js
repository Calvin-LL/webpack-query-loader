module.exports = function (content) {
  this.emitWarning(new Error(`loader1-main ${content}`));

  return `module.exports = ${JSON.stringify(
    this.fs.readFileSync(this.resourcePath, "utf8")
  )}`;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  this.emitWarning(
    new Error(
      `loader1-pitch ${remainingRequest} ${precedingRequest} ${JSON.stringify(
        data
      )}`
    )
  );

  return;
};

module.exports.raw = false;
