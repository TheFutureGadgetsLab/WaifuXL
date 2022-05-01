/**
 * Returns whether the given string is a valid http(s) url
 *
 * @param {string} string URL to check
 * @returns Whether the string is a valid URL
 */
export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export async function uploadToImgur(dataURI) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID e5f8d00a71976ed");

  var formdata = new FormData();
  formdata.append(
    "image",
    dataURI.slice(22, )
  );
  formdata.append("type", "base64");
  formdata.append("name", "waifu");
  formdata.append("title", "WaifuXL Upload");
  formdata.append("description", "WaifuXL Upload");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  let response = await fetch("https://api.imgur.com/3/upload", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  console.log(response)
}
