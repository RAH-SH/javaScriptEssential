/**
 *   <input class="search-text" type="text" placeholder="Enter a destination or Key">
            <div class="seach-control">
                <img src="./images/search.png" width="20px" height="20px" class="search-icon">
                <button id='btnSearch' class="btn-searchMenu">Search</button><button id='btnSearch'
                    class="btn-searchMenu">Clear</button>
            </div>
 */
let results = [];
const resultContainer = document.getElementById("result-content");
const input = document.getElementById("search-text");

const btnSearch = document.getElementById("btnSearch");
btnSearch?.addEventListener("click", Search);
const searchIconBtn = document.getElementById("search-icon-btn");
searchIconBtn?.addEventListener("click", Search);
const btnClear = document.getElementById("btnClear");
btnClear?.addEventListener("click", function () {
  input.value = "";
  results = [];
  resultContainer.innerHTML = "";resultContainer.classList.remove("result-content");
});
input?.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    Search();
  }
});
function Search() {
    results = []
     
  const query = input ? input.value.toLowerCase().trim() : "";

  fetch("./travel_recommendation_api.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log(data);

      let type = "";
      if (query == "country") {
        data.countries.forEach((country) => {
          country.cities.forEach((city) =>
            results.push({
              image: city.imageUrl,
              name: city.name,
              description: city.description || "",
            }),
          );
        });
        type = "countries";
        console.log("Länder:", results);
        displayResults(results, "Alle Länder",null); // Popup hinzugefügt
        return;
      }

      if (query == "temple") {
        data.temples.forEach((temple) => {
          results.push({
            image: temple.imageUrl,
            name: temple.name,
            description: temple.description || "",
          });
        });
        type = "temple";
        console.log("Tempel:", results);
        displayResults(results, "Alle Tempel",null);
        return;
      }

      if (query == "beach") {
        data.beaches.forEach((beach) => {
          results.push({
            image: beach.imageUrl,
            name: beach.name,
            description: beach.description || "",
          }); // ✅ FIX!
        });
        type = "beaches";
        console.log("Strände:", results);
        displayResults(results, "Alle Strände",null);
        return;
      }
      let title=null;
      const countryMatch = data.countries.find(
        (c) => c.name.toLowerCase() === query,
      );
      if (countryMatch) {
        countryMatch.cities.forEach((city) =>
          results.push({
            image: city.imageUrl,
            name: city.name,
            description: city.description || "",
          }),
        );

        type = "City";
        title=query;
      }
      const templeMatch = data.temples.find(
        (t) => t.name.toLowerCase() === query,
      );
      if (templeMatch) {
        results.push({
          image: templeMatch.imageUrl,
          name: templeMatch.name,
          description: templeMatch.description || "",
        });
        type = "temple-name";
      }
      const beachMatch = data.beaches.find(
        (b) => b.name.toLowerCase() === query,
      );

      if (beachMatch) {
        results.push({
          image: beachMatch.imageUrl,
          name: beachMatch.name,
          description: beachMatch.description || "",
        });
        type = "beach-name";
      }
      if (results.length) {
        displayResults(results, `Exakte Treffer fur "${query}"`,title);
      } else {
        alert(
          `❌ Kein Treffer für "${query}". Probiere: countrie, temple, beache`,
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Live Server starten!");
    });
}
function displayResults(results, type,t) {
let  html='';
if(t )
{
    const date= new Date();
      html = `<h3 > ${date}</h3>`;
}
   html += `
   
       <div class="results-grid">
       
  `;

  results.forEach((r) => {
   
    html += `
        <div class="card">
                <img alt="" width="100%" height="65%"
                        src="./images/${r.image}" alt="${r.name}" >
                <div class="xx">
                                <h2 class="title-card">${r.name}</h2>
                                 <p class="description-info">${r.description}</p>
                                 <button class="visitus"> Visit us</button>
                </div>
        </div>
    `;
  });

  html += `</div>`;
resultContainer.classList.add("result-content");
  resultContainer.innerHTML = html;
}
