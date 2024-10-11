class Canvas
{
	constructor(width, height)
	{
		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.setAttribute("width", width);
		this.svg.setAttribute("height", height);
		this.width = width;
		this.height = height;
	}

	fill(colour)
	{
		this.addRect(0, 0, this.width, this.height, colour);
	}

	addRect(x, y, width, height, fill)
	{
		let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		rect.setAttribute("width", width);
		rect.setAttribute("height", height);
		rect.setAttribute("fill", fill);
		this.svg.appendChild(rect);
	}
}

function lerp(start, end, t)
{
	return start + t * (end - start);
}

class ResponseCurve
{
	constructor()
	{
		this.points = [];
	}

	getY(x)
	{
		let left = { x: 0.0, y: 0.0 };
		let right = { x: 1.0, y: 1.0 };

		for (const point of this.points)
		{
			if (x <= point.x)
			{
				right = point;
				break;
			}

			if (left.x <= point.x)
			{
				left = point;
			}
		}

		return lerp(left.y, right.y, (x - left.x) / (right.x - left.x));
	}


	toCanvas(width, height)
	{
		const canvas = new Canvas(width, height);
		const x_max = width - 1;
		const y_max = height - 1;
		for (let x = 0; x != width; ++x)
		{
			const bar_height = Math.floor(this.getY(x / x_max) * y_max);
			canvas.addRect(x, y_max - bar_height, 1, bar_height, "white");
		}
		return canvas;
	}
}
