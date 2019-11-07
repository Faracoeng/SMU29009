var selfEasyrtcid = "";
var haveSelfVideo = false;
var otherEasyrtcid = null;
function disable(domId) {
  console.log("about to try disabling " + domId);
  document.getElementById(domId).disabled = "disabled";
}
function enable(domId) {
  console.log("about to try enabling " + domId);
  document.getElementById(domId).disabled = "";
}
function createLabelledButton(buttonLabel) {
  var button = document.createElement("button");
  button.appendChild(document.createTextNode(buttonLabel));
  document.getElementById("videoSrcBlk").appendChild(button);
  return button;
}
function addMediaStreamToDiv(divId, stream, streamName, isLocal)
{
  var container = document.createElement("div");
  container.style.marginBottom = "10px";
  var formattedName = streamName.replace("(", "<br>").replace(")", "");
  var labelBlock = document.createElement("div");
  labelBlock.style.width = "220px";
  labelBlock.style.cssFloat = "left";
