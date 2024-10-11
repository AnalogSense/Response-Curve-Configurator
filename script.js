window.rc = new ResponseCurve();

function download(name, contents)
{
	let blob = new Blob([contents], {type: "octet/stream"});
	let blob_url = window.URL.createObjectURL(blob);
	let a = document.createElement("a");
	a.href = blob_url;
	a.download = name;
	a.click();
}

function addPoint()
{
	rc.points.push({
		x: parseInt(document.getElementById("add-x").value) / 100,
		y: parseInt(document.getElementById("add-y").value) / 100,
	});
	rc.points.sort((a, b) => a.x - b.x);

	document.getElementById("points-json").value = "[\n" + rc.points.map(x => "  " + JSON.stringify(x)).join(",\n") + "\n]";

	updateVisualisation();
}

document.getElementById("points-json").onchange = function()
{
	rc.points = JSON.parse(this.value);
	rc.points.sort((a, b) => a.x - b.x);

	updateVisualisation();
};

function updateVisualisation()
{
	document.getElementById("svg-container").innerHTML = "";
	const c = rc.toCanvas(document.getElementById("svg-container").clientWidth - 32, document.getElementById("svg-container").clientWidth - 32);
	document.getElementById("svg-container").appendChild(c.svg);
}
updateVisualisation();
window.onresize = updateVisualisation;

async function startSimulation()
{
	const dev = await analogsense.requestDevice();
	if (dev)
	{
		startSimulationWithDevice(dev);
	}
}

function startSimulationWithDevice(dev)
{
	document.getElementById("sim-start").classList.add("d-none");
	document.getElementById("sim-active").classList.remove("d-none");
	dev.startListening(function(keys)
	{
		let value = 0.0;
		for (const key of keys)
		{
			value = Math.max(key.value, value);
		}

		document.getElementById("sim-in-fill").style.height = (value * 100) + "%";
		document.getElementById("sim-out-fill").style.height = (rc.getY(value) * 100) + "%";
	});
}

analogsense.getDevices().then(function(devices)
{
	if (devices.length != 0)
	{
		startSimulationWithDevice(devices[0]);
	}
});
