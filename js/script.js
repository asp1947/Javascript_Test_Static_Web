// 메뉴 버튼에 대한 이벤트 리스너를 조정하여 내비게이션 바를 토글
var menubttn = document.getElementById('bttn');
var navBar = document.getElementById('navBar');
var submitbutton = document.getElementById('submit');

var StartStationDropdown = document.getElementById('startStation');
var StartLineDropdown = document.getElementById('startLineNo');
var EndStationDropdown = document.getElementById('endStation');
var EndLineDropdown = document.getElementById('endLineNo');

const url = "http://swopenapi.seoul.go.kr/api/subway/"
const url_define = "/json/realtimeStationArrival/0/3/"

async function getAuthKey() {
  try {
      const response = await fetch('[keyjsonfilepath]');
      const config = await response.json();
      return config.key;
  } catch (error) {
      console.error('Error:', error);
  }
}


menubttn.addEventListener('click', function() {
    navBar.classList.toggle('active');
    bttn.classList.toggle('active')
})

submitbutton.addEventListener('click', () => {

  addRowTrainTable("출발", StartStationDropdown.value, "");
  addRowTrainTable("도착", EndStationDropdown.value, "");
})

// 호선별 역 데이터를 그룹화하는 함수
function groupStationsByLine(data) {
    const lineStations = {};
    data.forEach(station => {
      // SUBWAY_ID의 첫 번째 자리를 사용하여 호선을 식별합니다.
      const lineKey = station.SUBWAY_ID.toString().substr(3, 1) + '호선';
      if (!lineStations[lineKey]) {
        lineStations[lineKey] = [];
      }
      if (!lineStations[lineKey].includes(station.STATN_NM)) {
        lineStations[lineKey].push(station.STATN_NM);
      }
    });
    return lineStations;
  }
  
  // 드랍다운 메뉴를 초기화하는 함수
  function initializeDropdown(dropdown, options) {
    options.forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      dropdown.appendChild(option);
    });
  }
  
  // 선택된 호선에 따라 역명 드랍다운을 업데이트하는 함수
  function updateStationDropdown(lineStations, selectedLine, stationDropdown) {
    stationDropdown.innerHTML = ''; // 기존의 옵션을 초기화합니다.
    if (lineStations[selectedLine]) {
      initializeDropdown(stationDropdown, lineStations[selectedLine]);
    }
  }
  
  // JSON 데이터를 로드하고 드랍다운을 설정하는 함수
  function setupDropdowns() {
    fetch('[jsonfilepath]') // JSON 파일의 실제 경로로 대체해야 합니다.
      .then(response => response.json())
      .then(json => {
        const lineStations = groupStationsByLine(json.DATA);
  
        // 호선 선택 드랍다운을 초기화합니다.
        initializeDropdown(StartLineDropdown, Object.keys(lineStations).sort());
        initializeDropdown(EndLineDropdown, Object.keys(lineStations).sort());
  
        // 출발 호선 선택 시 역명 드랍다운을 업데이트합니다.
        StartLineDropdown.addEventListener('change', function() {
          updateStationDropdown(lineStations, this.value, StartStationDropdown);
        });
  
        // 도착 호선 선택 시 역명 드랍다운을 업데이트합니다.
        EndLineDropdown.addEventListener('change', function() {
          updateStationDropdown(lineStations, this.value, EndStationDropdown);
        });
      })
      .catch(error => {
        console.error('Error loading JSON data:', error);
      });
  }

  function addRowTrainTable(StEdstats, StationNm, blank) {
    const hTbody = document.getElementById('htmlTbody')
    const newRow = hTbody.insertRow();
    
    getAuthKey().then(authKey => {
      fetch(url + authKey + url_define + StationNm)
      .then(res => res.json())
      .then(json => {
        const firstArrival = json.realtimeArrivalList[0];
        const barvlDt = parseInt(firstArrival.barvlDt);
        let displayText;

        if (barvlDt === 0) {
          // 열차가 도착한 경우
          displayText = firstArrival.arvlMsg2;
        } else if (barvlDt < 60) {
          // 60초 미만일 경우
          displayText = barvlDt + "초";
        } else {
          // 60초 이상일 경우 (초단위 생략)
          let minutes = Math.floor(barvlDt / 60);
          displayText = minutes + "분";
        }

        // 셀에 표시될 값 설정
        const newCell1 = newRow.insertCell(0);
        const newCell2 = newRow.insertCell(1);
        const newCell3 = newRow.insertCell(2);
        const newCell4 = newRow.insertCell(3);

        newCell1.innerText = StEdstats;
        newCell2.innerText = StationNm;
        newCell3.innerText = displayText;
        newCell4.innerText = blank;
      })
      .catch(error => console.error('Error:', error));
    });
  }
  
  // 문서 로드 완료 후 드랍다운 설정 함수를 호출합니다.
  document.addEventListener('DOMContentLoaded', setupDropdowns);