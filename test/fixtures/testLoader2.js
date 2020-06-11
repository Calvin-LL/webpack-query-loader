module.exports = function (content) {
  this.emitWarning(new Error(`loader2-main ${content}`));

  return content;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  this.emitWarning(
    new Error(
      `loader2-pitch ${remainingRequest} ${precedingRequest} ${JSON.stringify(
        data
      )}`
    )
  );

  return;
};

module.exports.raw = true;
