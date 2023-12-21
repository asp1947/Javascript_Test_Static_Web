// 1호선 역 정보의 배열
const line1Stations = [
  { id: "1001000159", name: "도원", branch: false },
  { id: "1001000160", name: "동인천", branch: false },
  { id: "1001000161", name: "인천", branch: false },
  // 분기점과 셔틀 구간 포함
  { id: "1001000141", name: "구로", branch: true },
  { id: "1001075410", name: "광명", branch: true, shuttle: true }, // 셔틀
  { id: "1001080142", name: "가산디지털단지", branch: true },
  { id: "1001080143", name: "독산", branch: false },
  { id: "1001080144", name: "금천구청", branch: false },
  { id: "1001080145", name: "석수", branch: false },
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

// 1호선 역 정보와 인덱스 매핑
const line1StationsIndex = {
  "소요산": 0,
  "동두천": 1,
  // ... 나머지 역 인덱스
  "영등포": 38,
  "구로": 39,
  "가산디지털단지": 40,
  // ... 분기점 이후 역 인덱스
  "관악": 47,
  "광명": 48, // 셔틀 역
  "서동탄": 49, // 셔틀 역
  // ... 나머지 역 인덱스
};

// 역간 평균 소요시간을 초 단위로 변환
const averageTimePerStation = 1 * 60 + 45;

function calculateTimeBetweenStations(startIndex, endIndex) {
  const stationCount = Math.abs(endIndex - startIndex);
  const totalTimeInSeconds = stationCount * averageTimePerStation;
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;
  return { minutes, seconds, totalTimeInSeconds };
}
// 메인 라인과 분기점 라인의 인덱스 범위를 정의
const mainLineRange = { start: 0, end: 39 }; // 예시 인덱스 범위, 실제 값으로 대체 필요
const branchLineRange = { start: 40, end: line1StationsIndex["신창"] }; // 신창역까지의 범위

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

  // 같은 라인에 있는 경우를 확인
  if (startIndex !== undefined && endIndex !== undefined) {
    // 출발지와 도착지가 메인 라인 범위 내에 있는지 확인
    const onSameMainLine =
      isInRange(startIndex, mainLineRange) &&
      isInRange(endIndex, mainLineRange);
    // 출발지와 도착지가 분기점 라인 범위 내에 있는지 확인
    const onSameBranchLine =
      isInRange(startIndex, branchLineRange) &&
      isInRange(endIndex, branchLineRange);

    if (onSameMainLine || onSameBranchLine) {
      // 같은 라인에 있는 경우
      const time = calculateTimeBetweenStations(startIndex, endIndex);
      return `소요 시간: ${time.minutes}분 ${time.seconds}초`;
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
        toTransferTime.totalTimeInSeconds + fromTransferTime.totalTimeInSeconds;
      const totalMinutes = Math.floor(totalTimeInSeconds / 60);
      const totalSeconds = totalTimeInSeconds % 60;
      return `환승을 포함한 소요 시간: ${totalMinutes}분 ${totalSeconds}초`;
    }
  }

  // 인덱스가 정의되지 않은 경우, 즉 역이 리스트에 없는 경우
  alert("출발지나 도착지가 역 리스트에 없습니다.");
}

// 사용 예
console.log(analyzeRoute("소요산", "영등포")); // 같은 메인 라인에 있는 경우
console.log(analyzeRoute("영등포", "관악")); // 다른 라인에 있는 경우
