// 목업 DB fixture. 전부 지어낸 데이터다(실제 회원·게시물 아님). 이메일은 예약 도메인 example.com 만 쓴다.
// 시각은 seed 시점 기준 상대값이라 매번 "몇 시간 전" 글로 보인다.
// 반환 순서 = INSERT 순서(FK 때문에 부모 테이블이 먼저).

const id = (prefix, n) => `${prefix}0000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const U = (n) => id('1', n);
const F = (n) => id('2', n);
const M = (n) => id('3', n);
const T = (n) => id('4', n);
const C = (n) => id('5', n);
const X = (n) => id('6', n); // 그 밖의 행

const DEMO_PASSWORD = 'keeping1234';

const USERS = [
  // n, nickname, email(=providedId), aboutMe, color, avatar
  [1, '키핑데모', 'demo@example.com', '필름 카메라로 동네 골목을 기록해요', '#FFE885', 1],
  [2, '오후의필름', 'film@example.com', '해 질 녘 빛을 좋아합니다', '#BBE17B', 2],
  [3, '주말보드게이머', 'boardgame@example.com', '매주 토요일 보드게임 모임', '#BBEAFF', 3],
  [4, '반죽하는곰', 'baking@example.com', '천연발효종 키우는 중', '#A2BDFC', 4],
  [5, '별보는캠퍼', 'camping@example.com', '은하수 보러 캠핑 다녀요', '#FFA5C1', 5],
  [6, '코바늘연구소', 'knit@example.com', '실 한 타래로 만드는 것들', '#FFE885', 6],
  [7, '홀드위에서', 'climb@example.com', '볼더링 3년 차', '#BBE17B', 7],
  [8, '키핑에디터', 'editor@example.com', '키핑 매거진 에디터', '#A2BDFC', 8],
];

const TOPICS = [
  [1, '사진', 'Photo', 'feed/feed-01.svg'],
  [2, '보드 게임', 'Board Game', 'feed/feed-05.svg'],
  [3, '홈 베이킹', 'Home Baking', 'feed/feed-07.svg'],
  [4, '캠핑', 'Camping', 'feed/feed-09.svg'],
  [5, '공예', 'Craft', 'feed/feed-11.svg'],
  [6, '클라이밍', 'Climbing', 'feed/feed-13.svg'],
];

// n, writer, hoursAgo, content, pictures(feed-NN), tags, topic
const FEEDS = [
  [1, 2, 1, '퇴근길 골목에 비친 노을. 필름 한 롤 다 쓰고 왔어요.', [1, 2], ['필름카메라', '노을'], 1],
  [2, 3, 3, '이번 주 모임은 협력 게임 위주로! 다들 처음인데도 금방 익혔어요.', [5], ['보드 게임', '협력게임'], 2],
  [3, 4, 5, '사워도우 3일 차. 쿠프가 드디어 터졌습니다.', [7, 8], ['홈베이킹', '사워도우'], 3],
  [4, 5, 8, '구름이 걷히고 은하수가 보였던 밤', [9], ['캠핑', '별사진'], 4],
  [5, 6, 11, '코바늘로 뜬 컵받침 세트. 색 조합 고민 많이 했어요.', [11, 12], ['코바늘', '뜨개질'], 5],
  [6, 7, 14, '새로 생긴 암장 오픈 세팅 다녀왔어요. 노란 문제 완등!', [13], ['클라이밍', '볼더링'], 6],
  [7, 1, 18, '동네 철물점 간판. 오래된 글씨체가 좋아서 찍어 둠', [3], ['필름카메라', '골목'], 1],
  [8, 3, 22, '보드게임 카페에서 처음 해 본 다크 나이트 테마 추리 게임', [6], ['보드게임', '다크 나이트'], 2],
  [9, 4, 27, '휴일 아침 스콘. 버터를 차갑게 유지하는 게 핵심', [8], ['홈 베이킹', '스콘'], 3],
  [10, 5, 31, '첫 동계 캠핑 장비 점검 리스트 공유합니다', [10], ['캠핑', '동계캠핑'], 4],
  [11, 2, 36, '흑백 필름으로 찍은 시장 풍경', [4], ['필름 카메라', '흑백'], 1],
  [12, 6, 41, '뜨개 가방 완성. 손잡이는 가죽으로 달았어요', [12], ['뜨개질', '가방'], 5],
  [13, 7, 47, '손가락 테이핑 하는 법 정리', [14], ['클라이밍', '테이핑'], 6],
  [14, 1, 53, '첫 롤 현상 결과. 노출이 생각보다 잘 맞았다', [2, 15], ['필름카메라', '현상'], 1],
  [15, 3, 60, '2인용으로 좋은 게임 추천 받아요', [16], ['보드 게임', '2인게임'], 2],
  [16, 4, 66, '바게트 성형 연습. 아직 칼집이 어렵네요', [7], ['홈베이킹', '바게트'], 3],
];

// 좋아요: [feed, user]
const FEED_LIKES = [
  [1, 1], [1, 3], [1, 4], [1, 5], [2, 1], [2, 4], [3, 1], [3, 2], [3, 5], [3, 6], [3, 7],
  [4, 2], [4, 1], [5, 4], [6, 1], [6, 5], [8, 1], [9, 2], [11, 1], [14, 2], [14, 3],
];
const FEED_BOOKMARKS = [[1, 1], [3, 1], [4, 1], [2, 5]];

// 댓글: n, feed, writer, parent(n|null), hoursAgo, text, mentions(user[])
const COMMENTS = [
  [1, 1, 1, null, 0.8, '빛이 정말 따뜻하네요. 어떤 필름 쓰셨어요?', []],
  [2, 1, 2, 1, 0.6, '포트라 400이에요!', [1]],
  [3, 1, 4, null, 0.5, '저도 이 골목 알아요 ㅎㅎ', []],
  [4, 3, 1, null, 4, '쿠프 너무 예쁘게 터졌어요', []],
  [5, 3, 4, 4, 3.8, '감사합니다! 온도 조절이 핵심이었어요', [1]],
  [6, 3, 6, null, 3.5, '레시피 공유 가능할까요?', []],
  [7, 2, 5, null, 2.5, '협력 게임 추천 리스트 궁금해요', []],
  [8, 2, 3, 7, 2.2, '다음 글에 정리해서 올릴게요', [5]],
  [9, 4, 1, null, 7, '은하수 사진 처음 봐요. 장비가 궁금합니다', []],
];
const COMMENT_LIKES = [[1, 2], [1, 4], [2, 1], [4, 4], [5, 1], [9, 5]];

const FOLLOWS = [[1, 2], [1, 3], [1, 4], [2, 1], [5, 1], [3, 4], [4, 2], [6, 1], [7, 5]];

// n, category, top, hoursAgo, picture(magazine-NN), ko title, ko body, en title, en body, tags [ko, en][]
const MAGAZINES = [
  [1, 'magazine_category_news', 1, 10, 1, '필름 카메라 입문 가이드', '처음 필름 카메라를 고를 때 확인할 세 가지를 정리했습니다.', 'A Beginner Guide to Film Cameras', 'Three things to check when picking your first film camera.', [['필름 카메라', 'Film Camera'], ['입문', 'Beginner']]],
  [2, 'magazine_category_release', 2, 30, 2, '이번 달 신작 보드게임', '협력·추리 장르 신작 다섯 편을 소개합니다.', 'New Board Games This Month', 'Five new co-op and deduction games.', [['보드 게임', 'Board Game'], ['다크 나이트', 'Dark Knight']]],
  [3, 'magazine_category_news', 3, 50, 3, '동계 캠핑 체크리스트', '추운 밤을 버티는 장비와 습관.', 'Winter Camping Checklist', 'Gear and habits for cold nights.', [['캠핑', 'Camping']]],
  [4, 'magazine_category_news', null, 70, 4, '집에서 굽는 사워도우', '르방 관리부터 굽기까지 한 장으로.', 'Sourdough at Home', 'From levain care to baking, on one page.', [['홈 베이킹', 'Home Baking']]],
  [5, 'magazine_category_release', null, 90, 5, '코바늘 패턴 읽는 법', '기호표를 읽는 순서를 그림으로 풀었습니다.', 'How to Read Crochet Patterns', 'Reading chart symbols step by step.', [['공예', 'Craft'], ['뜨개질', 'Knitting']]],
  [6, 'magazine_category_news', null, 110, 6, '볼더링 첫 달에 알아둘 것', '부상 없이 오래 즐기기 위한 기본기.', 'Your First Month of Bouldering', 'Basics to climb longer without injury.', [['클라이밍', 'Climbing']]],
];
const MAGAZINE_BOOKMARKS = [[1, 1], [2, 1], [3, 5]];
const MAGAZINE_LIKES = [[1, 1], [1, 2], [2, 3], [3, 5], [4, 4]];
const MAGAZINE_VIEWS = [[1, 1, 2], [1, 2, 5], [2, 3, 6], [2, 1, 8], [3, 5, 12], [4, 4, 20]];

function build({ now, imgBase, passwordHash }) {
  const ago = (h) => new Date(now.getTime() - h * 3600 * 1000);
  const img = (p) => `${imgBase}/${p}`;
  const avatar = (n) => img(`avatar/avatar-${String(n).padStart(2, '0')}.svg`);
  const feedImg = (n) => img(`feed/feed-${String(n).padStart(2, '0')}.svg`);
  const magImg = (n) => img(`magazine/magazine-${String(n).padStart(2, '0')}.svg`);
  const created = ago(24 * 90);

  const user = USERS.map(([n, nickname, email, aboutMe, color]) => ({
    id: U(n),
    provider: 'keeping.link',
    provided_id: email,
    password: passwordHash,
    name: nickname,
    nickname,
    email,
    email_verified: 1,
    reset_password_link_used: 0,
    color,
    about_me: aboutMe,
    agreement_age: 1,
    agreement_privacy: 1,
    agreement_service_terms: 1,
    agreement_marketing: 0,
    deleted_at: null,
    created_at: created,
    updated_at: created,
  }));
  // 카카오로 가입한 기존 회원(목업 카카오 토큰 mock-kakao-existing 과 짝)
  user.push({
    id: U(9), provider: 'kakao.com', provided_id: '1000000009', name: '카카오데모', nickname: '카카오데모',
    email: 'kakao-demo@example.com', email_verified: 1, color: '#BBEAFF', about_me: '카카오로 가입한 데모 회원',
    agreement_age: 1, agreement_privacy: 1, agreement_service_terms: 1, agreement_marketing: 0,
    created_at: created, updated_at: created,
  });
  // 탈퇴 신청(유예) 상태 회원: 로그인하면 failure:deleted 를 받는다
  user.push({
    id: U(10), provider: 'keeping.link', provided_id: 'withdrawal@example.com', password: passwordHash,
    name: '탈퇴유예', nickname: '탈퇴유예', email: 'withdrawal@example.com', email_verified: 1, color: '#FFA5C1',
    agreement_age: 1, agreement_privacy: 1, agreement_service_terms: 1, agreement_marketing: 0,
    deleted_at: ago(24), created_at: created, updated_at: ago(24),
  });

  const user_picture = USERS.map(([n, , , , , a]) => ({ id: X(100 + n), user_id: U(n), url: avatar(a), created_at: created }));
  user_picture.push({ id: X(109), user_id: U(9), url: avatar(9), created_at: created });
  const user_background = [{ id: X(201), user_id: U(1), url: magImg(7), created_at: created }];
  const user_withdrawal_temporary = [{ id: X(301), user_id: U(10), reason: '잠시 쉬어 가려고요' }];
  const user_search = [
    { id: X(401), user_id: U(1), text: '필름카메라', created_at: ago(2) },
    { id: X(402), user_id: U(1), text: '보드게임', created_at: ago(5) },
  ];
  const follow = FOLLOWS.map(([from, to], i) => ({ id: X(500 + i), from_user: U(from), to_user: U(to), created_at: ago(100 + i) }));

  const topic_item = TOPICS.map(([n, ko, en, p]) => ({ id: T(n), name_ko: ko, name_en: en, url: img(p) }));

  const feed = FEEDS.map(([n, w, h, content, pics]) => ({
    id: F(n), user_id: U(w), state: 'feed_state_posting', content, picture: feedImg(pics[0]),
    uploaded_at: ago(h), sorted_at: ago(h), created_at: ago(h + 0.2), updated_at: ago(h),
  }));
  // 데모 사용자의 등록 전 초안(작성 이어하기 시나리오: POST /feed/createFeed?rewrite=false)
  feed.push({ id: F(99), user_id: U(1), state: 'feed_state_pending', content: '', created_at: ago(0.3), updated_at: ago(0.3) });

  const feed_picture = FEEDS.flatMap(([n, , h, , pics]) =>
    pics.map((p, i) => ({ id: X(1000 + n * 10 + i), feed_id: F(n), url: feedImg(p), created_at: ago(h + 0.1) })));
  const feed_tag = FEEDS.flatMap(([n, , h, , , tags]) =>
    tags.map((name, i) => ({ id: X(2000 + n * 10 + i), feed_id: F(n), name, created_at: ago(h + 0.1) })));
  const feed_topic = FEEDS.map(([n, , h, , , , t]) => ({ id: X(3000 + n), feed_id: F(n), topic_id: T(t), created_at: ago(h) }));
  const feed_like = FEED_LIKES.map(([f, u], i) => ({ feed_id: F(f), user_id: U(u), created_at: ago(0.5 + i) }));
  const feed_bookmark = FEED_BOOKMARKS.map(([f, u], i) => ({ id: X(4000 + i), feed_id: F(f), user_id: U(u), created_at: ago(1 + i) }));
  const feed_comment = COMMENTS.map(([n, f, w, parent, h, text]) => ({
    id: C(n), feed_id: F(f), user_id: U(w), parent_id: parent ? C(parent) : null, text, created_at: ago(h), updated_at: ago(h),
  }));
  const feed_comment_mention = COMMENTS.flatMap(([n, , , , h, , mentions]) =>
    mentions.map((u, i) => ({ id: X(5000 + n * 10 + i), feed_comment_id: C(n), mention_user_id: U(u), created_at: ago(h) })));
  const feed_comment_like = COMMENT_LIKES.map(([c, u], i) => ({ id: X(6000 + i), feed_comment_id: C(c), user_id: U(u) }));

  const magazine = MAGAZINES.map(([n, category, top, h, pic]) => ({
    id: M(n), user_id: U(8), category, state: 'magazine_state_posting', picture: magImg(pic), top_view_number: top,
    created_at: ago(h), updated_at: ago(h),
  }));
  const magazine_body_ko = MAGAZINES.map(([n, , , , , title, body]) => ({ id: X(7000 + n), magazine_id: M(n), title, body }));
  const magazine_body_en = MAGAZINES.map(([n, , , , , , , title, body]) => ({ id: X(7100 + n), magazine_id: M(n), title, body }));
  const magazine_picture = MAGAZINES.map(([n, , , h, pic]) => ({ id: X(7200 + n), magazine_id: M(n), name: `magazine-${pic}.svg`, url: magImg(pic), created_at: ago(h) }));
  const magazine_tag = MAGAZINES.flatMap(([n, , , h, , , , , , tags]) =>
    tags.map(([ko, en], i) => ({ id: X(7300 + n * 10 + i), magazine_id: M(n), name_ko: ko, name_en: en, created_at: ago(h) })));
  const magazine_topic = [
    { id: X(7401), magazine_id: M(1), topic_id: T(1), created_at: ago(10) },
    { id: X(7402), magazine_id: M(2), topic_id: T(2), created_at: ago(30) },
  ];
  const magazine_bookmark = MAGAZINE_BOOKMARKS.map(([m, u], i) => ({ id: X(7500 + i), magazine_id: M(m), user_id: U(u), created_at: ago(3 + i) }));
  const magazine_like = MAGAZINE_LIKES.map(([m, u], i) => ({ id: X(7600 + i), magazine_id: M(m), user_id: U(u), created_at: ago(4 + i) }));
  const magazine_views = MAGAZINE_VIEWS.map(([m, u, h], i) => ({ id: X(7700 + i), magazine_id: M(m), user_id: U(u), created_at: ago(h) }));

  const code_category = [
    { id: 'feed_state', text_ko: '피드 상태', text_en: 'Feed state', sequence_number: 1, select_yn: 1, created_by: 'mock', updated_by: 'mock' },
    { id: 'magazine_category', text_ko: '매거진 분류', text_en: 'Magazine category', sequence_number: 2, select_yn: 1, created_by: 'mock', updated_by: 'mock' },
  ];
  const code_item = [
    ['feed_state_pending', 'feed_state', '작성 중', 'Pending', 1],
    ['feed_state_posting', 'feed_state', '게시', 'Posting', 2],
    ['magazine_category_news', 'magazine_category', '소식', 'News', 1],
    ['magazine_category_release', 'magazine_category', '신작', 'Release', 2],
  ].map(([cid, cat, ko, en, seq]) => ({ id: cid, code_category_id: cat, text_ko: ko, text_en: en, sequence_number: seq, select_yn: 1, created_by: 'mock', updated_by: 'mock' }));

  const code_authority = [{
    id: X(8001), role_code: 'role_editor', description_ko: '에디터', description_en: 'Editor', priority: 1,
    write_permission: 1, read_permission: 1, modify_permission: 1, delete_permission: 0,
  }];
  const admin_user = [{ id: X(8101), user_id: U(8), code_authority_id: X(8001), user_name: '키핑에디터', description_text: '매거진 담당', modify_at: created }];
  const admin_menu = [
    { id: X(8201), menu_name: '매거진', parent_id: '', url: '/magazine', sort: 1, depth: 1, modified_at: created },
    { id: X(8202), menu_name: '회원', parent_id: '', url: '/user', sort: 2, depth: 1, modified_at: created },
  ];
  const authority_menus = admin_menu.map((m, i) => ({ id: X(8300 + i), admin_menu_id: m.id, code_authority_id: X(8001), modified_at: created }));

  return [
    ['user', user], ['user_picture', user_picture], ['user_background', user_background],
    ['user_withdrawal_temporary', user_withdrawal_temporary], ['user_search', user_search], ['follow', follow],
    ['topic_item', topic_item],
    ['feed', feed], ['feed_picture', feed_picture], ['feed_tag', feed_tag], ['feed_topic', feed_topic],
    ['feed_like', feed_like], ['feed_bookmark', feed_bookmark], ['feed_comment', feed_comment],
    ['feed_comment_mention', feed_comment_mention], ['feed_comment_like', feed_comment_like],
    ['magazine', magazine], ['magazine_body_ko', magazine_body_ko], ['magazine_body_en', magazine_body_en],
    ['magazine_picture', magazine_picture], ['magazine_tag', magazine_tag], ['magazine_topic', magazine_topic],
    ['magazine_bookmark', magazine_bookmark], ['magazine_like', magazine_like], ['magazine_views', magazine_views],
    ['code_category', code_category], ['code_item', code_item],
    ['code_authority', code_authority], ['admin_user', admin_user], ['admin-menu', admin_menu], ['authority_menus', authority_menus],
  ];
}

module.exports = { build, DEMO_PASSWORD, ids: { U, F, M, T, C } };
