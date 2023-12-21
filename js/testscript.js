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
    const startStationSelect = document.getElementById('startStation');
    const endStationSelect = document.getElementById('endStation');
  
    line1Stations.forEach(station => {
      // 분기점이 아닌 역만 메인 라인에 추가
      if (!station.branch || station.shuttle) {
        const option = document.createElement('option');
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
  
  function analyzeRoute(startStation, endStation) {
    // 출발지와 도착지가 같은 경우
    if (startStation === endStation) {
      return "출발지와 도착지가 동일합니다.";
    }
  
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
  
    // 출발지와 도착지의 인덱스를 찾는다.
    const startIndex = line1StationsIndex[startStation];
    const endIndex = line1StationsIndex[endStation];
  
    // 같은 라인에 있는 경우
    if (startIndex !== undefined && endIndex !== undefined) {
      const time = calculateTimeBetweenStations(startIndex, endIndex);
      return `소요 시간: ${time.minutes}분 ${time.seconds}초`;
    }
  
    // 다른 라인에 있는 경우
    // 구로를 기준으로 분기점을 찾는다.
    const transferIndex = line1StationsIndex["구로"];
    const toTransferTime = calculateTimeBetweenStations(startIndex, transferIndex);
    const fromTransferTime = calculateTimeBetweenStations(transferIndex, endIndex);
    const totalTimeInSeconds = toTransferTime.totalTimeInSeconds + fromTransferTime.totalTimeInSeconds;
    const totalMinutes = Math.floor(totalTimeInSeconds / 60);
    const totalSeconds = totalTimeInSeconds % 60;
    return `환승을 포함한 소요 시간: ${totalMinutes}분 ${totalSeconds}초`;
  }