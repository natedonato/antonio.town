let data = {
  name: "tonioposts",
	layout: "tonioposts",
  "tags": [
      "tonioposts"
  ]
};
data.test123 = "js activated"

if(process.env.NODE_ENV === "production") {
	data.date = "git Created";
}

module.exports = data;