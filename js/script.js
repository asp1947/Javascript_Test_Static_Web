// 메뉴 버튼에 대한 이벤트 리스너를 조정하여 내비게이션 바를 토글
var menubttn = document.getElementById("bttn");
var navBar = document.getElementById("navBar");
var submitbutton = document.getElementById("submit");

var StartStationDropdown = document.getElementById("startStation");
var StartLineDropdown = document.getElementById("startLineNo");
var EndStationDropdown = document.getElementById("endStation");
var EndLineDropdown = document.getElementById("endLineNo");

const url = "http://swopenapi.seoul.go.kr/api/subway/";
const url_define = "/json/realtimeStationArrival/0/3/";

async function getAuthKey() {
    try {
        const response = await fetch("[keyjsonfilepath]");
        const config = await response.json();
        return config.key;
    } catch (error) {
        console.error("Error:", error);
    }
}

menubttn.addEventListener("click", function () {
    navBar.classList.toggle("active");
    bttn.classList.toggle("active");
});

submitbutton.addEventListener("click", () => {
    // 출발역과 도착역 이름을 가져옵니다.
    const startStationName = StartStationDropdown.value;
    const endStationName = EndStationDropdown.value;

    // analyzeRoute 함수를 호출하여 소요시간을 계산합니다.
    const travelTime = analyzeRoute(startStationName, endStationName);

    // addRowTrainTable 함수를 사용하여 테이블에 출발역 정보와 소요시간을 추가합니다.
    addRowTrainTable("출발", startStationName, travelTime);
    addRowTrainTable("도착", endStationName, "");
});

// 호선별 역 데이터를 그룹화하는 함수
function groupStationsByLine(data) {
    const lineStations = {};
    data.forEach((station) => {
        // SUBWAY_ID의 첫 번째 자리를 사용하여 호선을 식별합니다.
        const lineKey = station.SUBWAY_ID.toString().substr(3, 1) + "호선";
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
    options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        dropdown.appendChild(option);
    });
}

// 선택된 호선에 따라 역명 드랍다운을 업데이트하는 함수
function updateStationDropdown(lineStations, selectedLine, stationDropdown) {
    stationDropdown.innerHTML = ""; // 기존의 옵션을 초기화합니다.
    if (lineStations[selectedLine]) {
        initializeDropdown(stationDropdown, lineStations[selectedLine]);
    }
}

// JSON 데이터를 로드하고 드랍다운을 설정하는 함수
function setupDropdowns() {
    fetch("[jsonfilepath]") // JSON 파일의 실제 경로로 대체해야 합니다.
        .then((response) => response.json())
        .then((json) => {
            const lineStations = groupStationsByLine(json.DATA);

            // 호선 선택 드랍다운을 초기화합니다.
            initializeDropdown(
                StartLineDropdown,
                Object.keys(lineStations).sort()
            );
            initializeDropdown(
                EndLineDropdown,
                Object.keys(lineStations).sort()
            );

            // 출발 호선 선택 시 역명 드랍다운을 업데이트합니다.
            StartLineDropdown.addEventListener("change", function () {
                updateStationDropdown(
                    lineStations,
                    this.value,
                    StartStationDropdown
                );
            });

            // 도착 호선 선택 시 역명 드랍다운을 업데이트합니다.
            EndLineDropdown.addEventListener("change", function () {
                updateStationDropdown(
                    lineStations,
                    this.value,
                    EndStationDropdown
                );
            });
        })
        .catch((error) => {
            console.error("Error loading JSON data:", error);
        });
}

// function addRowTrainTable(StEdstats, StationNm, blank) {
//   const hTbody = document.getElementById('htmlTbody')
//   const newRow = hTbody.insertRow();

//   getAuthKey().then(authKey => {
//     fetch(url + authKey + url_define + StationNm)
//     .then(res => res.json())
//     .then(json => {
//       const firstArrival = json.realtimeArrivalList[0];
//       const barvlDt = parseInt(firstArrival.barvlDt);
//       let displayText;

//       if (barvlDt === 0) {
//         // 열차가 도착한 경우
//         displayText = firstArrival.arvlMsg2;
//       } else if (barvlDt < 60) {
//         // 60초 미만일 경우
//         displayText = barvlDt + "초";
//       } else {
//         // 60초 이상일 경우 (초단위 생략)
//         let minutes = Math.floor(barvlDt / 60);
//         displayText = minutes + "분";
//       }

//       // 셀에 표시될 값 설정
//       const newCell1 = newRow.insertCell(0);
//       const newCell2 = newRow.insertCell(1);
//       const newCell3 = newRow.insertCell(2);
//       const newCell4 = newRow.insertCell(3);

//       newCell1.innerText = StEdstats;
//       newCell2.innerText = StationNm;
//       newCell3.innerText = displayText;
//       newCell4.innerText = blank;
//     })
//     .catch(error => console.error('Error:', error));
//   });
// }

function addRowTrainTable(StEdstats, StationNm, travelTime) {
    const hTbody = document.getElementById("htmlTbody");
    const newRow = hTbody.insertRow();

    // 셀에 표시될 값 설정
    const newCell1 = newRow.insertCell(0);
    const newCell2 = newRow.insertCell(1);
    const newCell3 = newRow.insertCell(2);

    newCell1.innerText = StEdstats;
    newCell2.innerText = StationNm;
    newCell3.innerText = travelTime;
}

// 1호선 역 정보의 배열
const line1Stations = [
    { id: "1001000100", name: "소요산", branch: false },
    { id: "1001000101", name: "동두천", branch: false },
    { id: "1001000102", name: "부산", branch: false },
    { id: "1001000103", name: "동두천중앙", branch: false },
    { id: "1001000104", name: "지행", branch: false },
    { id: "1001000105", name: "덕정", branch: false },
    { id: "1001000106", name: "덕계", branch: false },
    { id: "1001000107", name: "양주", branch: false },
    { id: "1001000108", name: "녹양", branch: false },
    { id: "1001000109", name: "가능", branch: false },
    { id: "1001000110", name: "의정부", branch: false },
    { id: "1001000111", name: "회룡", branch: false },
    { id: "1001000112", name: "망월사", branch: false },
    { id: "1001000113", name: "도봉산", branch: false },
    { id: "1001000114", name: "도봉", branch: false },
    { id: "1001000115", name: "방학", branch: false },
    { id: "1001000116", name: "창동", branch: false },
    { id: "1001000117", name: "녹천", branch: false },
    { id: "1001000118", name: "월계", branch: false },
    { id: "1001000119", name: "광운대", branch: false },
    { id: "1001000120", name: "석계", branch: false },
    { id: "1001000121", name: "신이문", branch: false },
    { id: "1001000122", name: "외대앞", branch: false },
    { id: "1001000123", name: "회기", branch: false },
    { id: "1001000124", name: "청량리", branch: false },
    { id: "1001000125", name: "제기동", branch: false },
    { id: "1001000126", name: "신설동", branch: false },
    { id: "1001000127", name: "동묘앞", branch: false },
    { id: "1001000128", name: "동대문", branch: false },
    { id: "1001000129", name: "종로5가", branch: false },
    { id: "1001000130", name: "종로3가", branch: false },
    { id: "1001000131", name: "종각", branch: false },
    { id: "1001000132", name: "시청", branch: false },
    { id: "1001000133", name: "서울", branch: false },
    { id: "1001000134", name: "남영", branch: false },
    { id: "1001000135", name: "용산", branch: false },
    { id: "1001000136", name: "노량진", branch: false },
    { id: "1001000137", name: "대방", branch: false },
    { id: "1001000138", name: "신길", branch: false },
    { id: "1001000139", name: "영등포", branch: false },
    { id: "1001000140", name: "신도림", branch: false },
    { id: "1001000142", name: "구일", branch: false },
    { id: "1001000143", name: "개봉", branch: false },
    { id: "1001000144", name: "오류동", branch: false },
    { id: "1001000145", name: "온수", branch: false },
    { id: "1001000146", name: "역곡", branch: false },
    { id: "1001000147", name: "소사", branch: false },
    { id: "1001000148", name: "부천", branch: false },
    { id: "1001000149", name: "중동", branch: false },
    { id: "1001000150", name: "송내", branch: false },
    { id: "1001000151", name: "부개", branch: false },
    { id: "1001000152", name: "부평", branch: false },
    { id: "1001000153", name: "백운", branch: false },
    { id: "1001000154", name: "동암", branch: false },
    { id: "1001000155", name: "간석", branch: false },
    { id: "1001000156", name: "주안", branch: false },
    { id: "1001000157", name: "도화", branch: false },
    { id: "1001000158", name: "제물포", branch: false },
    { id: "1001000159", name: "도원", branch: false },
    { id: "1001000160", name: "동인천", branch: false },
    { id: "1001000161", name: "인천", branch: false },
    // 분기점과 셔틀 구간 포함
    { id: "1001000141", name: "구로", branch: true },
    { id: "1001075410", name: "광명", branch: true, shuttle: true }, // 셔틀
    { id: "1001080142", name: "가산디지털단지", branch: true },
    { id: "1001080143", name: "독산", branch: true },
    { id: "1001080144", name: "금천구청", branch: true },
    { id: "1001080145", name: "석수", branch: true },
    { id: "1001080146", name: "관악", branch: true },
    { id: "1001080147", name: "안양", branch: true },
    { id: "1001080148", name: "명학", branch: true },
    { id: "1001080149", name: "금정", branch: true },
    { id: "1001080150", name: "군포", branch: true },
    { id: "1001080151", name: "당정", branch: true },
    { id: "1001080152", name: "의왕", branch: true },
    { id: "1001080153", name: "성균관대", branch: true },
    { id: "1001080154", name: "화서", branch: true },
    { id: "1001080155", name: "수원", branch: true },
    { id: "1001080156", name: "세류", branch: true },
    { id: "1001080157", name: "병점", branch: true },
    { id: "1001080158", name: "세마", branch: true },
    { id: "1001080159", name: "오산대", branch: true },
    { id: "1001080160", name: "오산", branch: true },
    { id: "1001080161", name: "진위", branch: true },
    { id: "1001080162", name: "송탄", branch: true },
    { id: "1001080163", name: "서정리", branch: true },
    { id: "1001080164", name: "지제", branch: true },
    { id: "1001080165", name: "평택", branch: true },
    { id: "1001080166", name: "성환", branch: true },
    { id: "1001080167", name: "직산", branch: true },
    { id: "1001080168", name: "두정", branch: true },
    { id: "1001080169", name: "천안", branch: true },
    { id: "1001080170", name: "봉명", branch: true },
    { id: "1001080171", name: "쌍용(나사렛대)", branch: true },
    { id: "1001080172", name: "아산", branch: true },
    { id: "1001080173", name: "탕정", branch: true },
    { id: "1001080174", name: "배방", branch: true },
    { id: "1001080175", name: "온양온천", branch: true },
    { id: "1001080176", name: "신창", branch: true },
    { id: "1001801571", name: "서동탄", branch: true, shuttle: true }, //셔틀

    // ... 나머지 역 정보
];

// 드랍다운 메뉴에 역 정보를 추가하는 함수
function populateStationDropdowns() {
    const startStationSelect = document.getElementById("startStation");
    const endStationSelect = document.getElementById("endStation");

    line1Stations.forEach((station) => {
        // 분기점이 아닌 역만 메인 라인에 추가
        if (!station.branch || station.shuttle) {
            const option = document.createElement("option");
            option.value = station.id;
            option.textContent = station.name;
            startStationSelect.appendChild(option.cloneNode(true));
            endStationSelect.appendChild(option);
        }
    });
}

// 역 이름을 키로 하고 ID를 값으로 하는 인덱스 맵을 생성합니다.
const line1StationsIndex = line1Stations.reduce((indexMap, station) => {
    indexMap[station.name] = station.id;
    return indexMap;
}, {});

// 메인 라인과 분기점 라인의 인덱스 범위를 정의
const mainLineRange = { start: "1001000100", end: "1001000141" }; // 예시 범위
const branchLineRange = { start: "1001080142", end: "1001080176" }; // 예시 범위

// 인덱스가 특정 범위 내에 있는지 확인하는 함수
function isInRange(stationId, range) {
    return stationId >= range.start && stationId <= range.end;
}

// 상행인지 하행인지 구분하는 함수
function getDirection(startId, endId) {
    return parseInt(startId) > parseInt(endId) ? "상행" : "하행";
}

// 역간 평균 소요시간을 초 단위로 변환
const averageTimePerStation = 1 * 60 + 45;

function calculateTimeBetweenStations(startIndex, endIndex) {
    const stationCount = Math.abs(endIndex - startIndex);
    const totalTimeInSeconds = stationCount * averageTimePerStation;
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    return { minutes, seconds, totalTimeInSeconds };
}

// 인덱스가 특정 범위 내에 있는지 확인하는 함수
function isInRange(index, range) {
    return index >= range.start && index <= range.end;
}

// 경로 분석 함수
function analyzeRoute(startStation, endStation) {
    // 출발지와 도착지가 같은 경우
    if (startStation === endStation) {
        return "출발지와 도착지가 동일합니다.";
    }

    // 출발지와 도착지의 인덱스를 찾는다.
    const startIndex = line1StationsIndex[startStation];
    const endIndex = line1StationsIndex[endStation];

    // 셔틀역인 광명과 서동탄을 처리하는 로직
    if (startStation === "광명") {
        startStation = "금천구청"; // 광명역에서 금천구청역을 거쳐야 함
    } else if (startStation === "서동탄") {
        startStation = "병점"; // 서동탄역에서 병점역을 거쳐야 함
    }

    if (endStation === "광명") {
        endStation = "금천구청"; // 도착지가 광명인 경우 금천구청역까지 계산
    } else if (endStation === "서동탄") {
        endStation = "병점"; // 도착지가 서동탄인 경우 병점역까지 계산
    }

    // 같은 라인에 있는 경우를 확인
    if (startIndex !== undefined && endIndex !== undefined) {
        // 출발지와 도착지가 메인 라인 범위 내에 있는지 확인
        const onSameMainLine =
            isInRange(startIndex, mainLineRange) &&
            isInRange(endIndex, mainLineRange);
        const onSameBranchLine =
            isInRange(startIndex, branchLineRange) &&
            isInRange(endIndex, branchLineRange);

        // 상행 혹은 하행을 구분
        const direction = getDirection(startIndex, endIndex);

        if (onSameMainLine || onSameBranchLine) {
            // 같은 라인에 있는 경우
            const time = calculateTimeBetweenStations(startIndex, endIndex);

            return `소요 시간: ${time.minutes}분 ${time.seconds}초, 방향: ${direction}`;
        } else {
            // 다른 라인에 있는 경우, 구로역에서의 환승을 가정
            const transferIndex = line1StationsIndex["구로"];
            const toTransferTime = calculateTimeBetweenStations(
                startIndex,
                transferIndex
            );
            const fromTransferTime = calculateTimeBetweenStations(
                transferIndex,
                endIndex
            );
            const totalTimeInSeconds =
                toTransferTime.totalTimeInSeconds +
                fromTransferTime.totalTimeInSeconds;
            const totalMinutes = Math.floor(totalTimeInSeconds / 60);
            const totalSeconds = totalTimeInSeconds % 60;
            return `소요 시간: ${totalMinutes}분 ${totalSeconds}초, 방향: ${direction}`;
        }
    }

    // 인덱스가 정의되지 않은 경우, 즉 역이 리스트에 없는 경우
    alert("출발지나 도착지가 역 리스트에 없습니다.");
}

// 사용 예
console.log(analyzeRoute("소요산", "영등포")); // 같은 메인 라인에 있는 경우
console.log(analyzeRoute("영등포", "관악")); // 다른 라인에 있는 경우

// 문서 로드 완료 후 드랍다운 설정 함수를 호출합니다.
document.addEventListener("DOMContentLoaded", setupDropdowns);
