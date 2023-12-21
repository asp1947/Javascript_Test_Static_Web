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
  