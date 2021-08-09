const API_BASE = "https://api.vagalume.com.br/search.php";
const key = "f7a7573efd4903db9376e36a4dbd5a63";

async function fetchLyric(title, band) {
  let response;
  let json;
  let error = null;

  try {
    response = await fetch(
      `${API_BASE}?art=${band}&mus=${title}&apikey=${key}`
    );

    json = await response.json();

    if (response.ok === false || json.type === "notfound")
      throw new Error(`Letra não encontrada.`);
  } catch (e) {
    json = null;
    error = e.message;
  } finally {
    return { response, json, error };
  }
}

export default fetchLyric;
