'use strict';
import { getReservations } from './api/api.js';

let reservations;

/**
 * 화면 진입 시 API 조회 후
 */
const getList = async () => {
  let response = await getReservations();
  response = response.filter((reservation) => reservation.status !== 'done');

  /**
   * 목록 set
   */
  const parentList = document.getElementById('list');

  response.forEach((reservation, idx) => {
    // 노출 데이터 가공
    const tables = reservation.tables.map((item) => item.name).join(', ');
    const menus = reservation.menus.map((item) => `${item.name}(${item.qty})`).join(', ');

    // 리스트 아이템 생성 및 아이디 부여
    const listItem = document.createElement('div');
    listItem.classList.add('list__item');
    listItem.setAttribute('data-id', reservation.id);

    // 상태 컨테이너 생성
    const itemStatus = document.createElement('div');
    itemStatus.classList.add('item__status');

    // 시간 설정
    const time = document.createElement('p');
    time.classList.add('time');
    const targetTime = reservation.timeReserved.split(' ')[1].split(':');
    time.innerText = `${targetTime[0]}:${targetTime[1]}`;
    itemStatus.appendChild(time);

    // 상태 설정
    const status = document.createElement('p');
    status.classList.add('status');

    if (reservation.status === 'reserved') {
      status.classList.add('reserved');
      status.innerText = '예약';
    }

    if (reservation.status === 'seated') {
      status.classList.add('seated');
      status.innerText = '착석 중';
    }

    itemStatus.appendChild(status);

    listItem.appendChild(itemStatus);

    // 리스트 아이템 내 상세 컨테이너 생성
    const itemDetails = document.createElement('ul');
    itemDetails.classList.add('item__details');

    // 고객 명 및 테이블 정보 설정
    const name = document.createElement('li');
    name.classList.add('detail__name');
    name.innerText = `${reservation.customer.name} - ${tables}`;
    itemDetails.appendChild(name);

    // 인원 정보 설정
    const personnel = document.createElement('li');
    personnel.classList.add('detail__personnel');

    if (reservation.customer.child === 0) {
      personnel.innerText = `성인${reservation.customer.adult}`;
    } else {
      personnel.innerText = `성인${reservation.customer.adult} 아이${reservation.customer.child}`;
    }
    itemDetails.appendChild(personnel);

    // 메뉴 정보 설정
    const menu = document.createElement('li');
    menu.classList.add('detail__menu');
    menu.innerText = menus;
    itemDetails.appendChild(menu);

    listItem.appendChild(itemDetails);

    // 버튼 정보 설정
    const reserveButton = document.createElement('button');
    reserveButton.classList.add('reservation__button');

    if (reservation.status === 'reserved') {
      reserveButton.classList.add('reserved');
      reserveButton.innerText = '착석';
    }

    if (reservation.status === 'seated') {
      reserveButton.classList.add('seated');
      reserveButton.innerText = '퇴석';
    }

    listItem.appendChild(reserveButton);

    parentList.appendChild(listItem);

    /**
     * 첫 번째 예약에 대한 details set
     */
    if (idx === 0) {
      // 부모 요소를 찾아서 변수에 저장
      const parent = document.getElementById('details');
      parent.setAttribute('data-id', reservation.id);

      const reservationTitle = document.createElement('h3');
      reservationTitle.innerText = '예약 정보';

      const customerTitle = document.createElement('h3');
      customerTitle.innerText = '고객 정보';

      // 닫기 버튼을 생성
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('details__btn-close');
      closeBtn.innerText = '닫기';

      // 예약 정보를 생성
      const reservationEl = document.createElement('div');
      reservationEl.classList.add('detail', 'detail__reservation');
      reservationEl.innerHTML = `
  <div class="reservation__wrap">
    <span class="reservation__title">예약 상태</span>
    <span id="dtl__status" class="reservation__value one-line">${
      reservation.status === 'reserved' ? '예약' : '착석 중'
    }</span>
  </div>
  <div class="reservation__wrap">
    <span class="reservation__title">예약 시간</span>
    <span id="dtl__time-reserved" class="reservation__value one-line">${reservation.timeReserved}</span>
  </div>
  <div class="reservation__wrap">
    <span class="reservation__title">접수 시간</span>
    <span id="dtl__time-registered" class="reservation__value one-line">${reservation.timeRegistered}</span>
  </div>
`;

      // 고객 정보를 생성
      const customer = document.createElement('div');
      customer.classList.add('detail', 'detail__customer');
      customer.innerHTML = `
  <div class="reservation__wrap">
    <span class="reservation__title">고객 성명</span>
    <span id="dtl__name" class="reservation__value one-line">${reservation.customer.name}</span>
  </div>
  <div class="reservation__wrap">
    <span class="reservation__title">고객 등급</span>
    <span id="dtl__level" class="reservation__value one-line">${reservation.customer.level}</span>
  </div>
  <div class="reservation__wrap">
    <span class="reservation__title">고객 메모</span>
    <span id="dtl__memo" class="reservation__value three-line">${reservation.customer.memo}</span>
  </div>
`;

      // 요청 사항을 생성
      const request = document.createElement('div');
      request.classList.add('detail', 'detail__request');
      request.innerHTML = `
  <div class="reservation__wrap">
    <span class="reservation__title">요청 사항</span>
    <span id="dtl__request" class="reservation__value three-line">${reservation.customer.request}</span>
  </div>
`;

      // 예약 정보와 고객 정보, 요청 사항을 부모 요소에 추가
      parent.appendChild(reservationTitle);
      parent.appendChild(reservationEl);
      parent.appendChild(customerTitle);
      parent.appendChild(customer);
      parent.appendChild(request);
      parent.appendChild(closeBtn);
    }
  });

  return response;
};

/**
 * 선택된 아이템 상세 조회
 * @param {string} id
 */
const setDetails = (id) => {
  const target = reservations.find((item) => item.id === id);

  const dtlStatus = document.querySelector('#dtl__status');
  dtlStatus.innerText = target.status === 'reserved' ? '예약' : '착석 중';

  const dtlTimeReserved = document.querySelector('#dtl__time-reserved');
  dtlTimeReserved.innerText = target.timeReserved;

  const dtlTimeRegistered = document.querySelector('#dtl__time-registered');
  dtlTimeRegistered.innerText = target.timeRegistered;

  const dtlName = document.querySelector('#dtl__name');
  dtlName.innerText = target.customer.name;

  const dtlLevel = document.querySelector('#dtl__level');
  dtlLevel.innerText = target.customer.level;

  const dtlMemo = document.querySelector('#dtl__memo');
  dtlMemo.innerText = target.customer.memo;

  const dtlRequest = document.querySelector('#dtl__request');
  dtlRequest.innerText = target.customer.request;
};

/**
 * 버튼 클릭 시 이벤트
 * @param {HTMLButtonElement} target
 */
const handleClickStatusBtn = (target) => {
  const id = target.parentNode.dataset.id;

  // 착석 버튼 클릭시
  if (target.classList.contains('reserved')) {
    // 원본 배열에서 값 변경
    reservations.map((item) => (item.id === id ? { ...item, status: 'seated' } : item));

    // 상태 값 변경
    const status = target.parentNode.querySelector('p.status');
    status.classList.remove('reserved');
    status.classList.add('seated');
    status.innerText = '착석 중';

    // 버튼 변경
    target.classList.remove('reserved');
    target.classList.add('seated');
    target.innerText = '퇴석';

    // 예약정보 변경
    const dtlStatus = document.querySelector('#dtl__status');
    dtlStatus.innerText = '착석 중';
  }

  // 퇴석 버튼 클릭 시
  if (target.classList.contains('seated')) {
    // 원본 배열에서 삭제
    reservations.filter((item) => item.id !== id);

    // html 요소 삭제
    const listItem = document.querySelector(`[data-id='${id}']`);
    listItem.remove();

    // 삭제된 요소의 상세페이지가 노출되고 있는 상태였다면 리스트의 첫번째 상세페이지 노출
    const currentDetails = document.getElementById('details');

    if (currentDetails.dataset.id === id) {
      const parent = document.getElementById('list');
      const newId = parent.firstChild.dataset.id;
      setDetails(newId);
    }
  }
};

(async function () {
  reservations = await getList();

  const listItemStatusEls = document.querySelectorAll('.item__status');
  const listItemDetailsEls = document.querySelectorAll('.item__details');
  const listItemBtnEls = document.querySelectorAll('.reservation__button');

  // 리스트 아이템 클릭시 이벤트 핸들러 바인딩
  listItemStatusEls.forEach((item) => {
    item.addEventListener('click', (e) => {
      setDetails(e.currentTarget.parentNode.dataset.id);
    });
  });

  // 리스트 아이템 클릭시 이벤트 핸들러 바인딩
  listItemDetailsEls.forEach((item) => {
    item.addEventListener('click', (e) => {
      setDetails(e.currentTarget.parentNode.dataset.id);
    });
  });

  // 버튼 클릭시 이벤트 핸들러 바인딩
  listItemBtnEls.forEach((item) => {
    item.addEventListener('click', (e) => {
      handleClickStatusBtn(e.currentTarget);
    });
  });
})();
