export const CHURCHES = [
  { code: 'gwangju', name: '광주' },
  { code: 'mokpo', name: '목포' },
  { code: 'yeosu', name: '여수' },
  { code: 'suncheon', name: '순천' },
  { code: 'songha', name: '송하' },
  { code: 'gwangyang', name: '광양' },
  { code: 'haenam', name: '해남' },
  { code: 'naju', name: '나주' },
] as const

export const FOCUS_AREAS = [
  { code: 'event_support', name: '행사시 교통업무 지원', id: 1 },
  { code: 'org_operation', name: '상시조직 구성 및 운영', id: 2 },
  { code: 'vehicle_mgmt', name: '차량 및 주차장 관리', id: 3 },
  { code: 'church_support', name: '지교회 업무지원 / 부서원 충원 및 신앙관리', id: 4 },
] as const

export const ACHIEVE_TYPES = [
  { key: 'achieveTypeSchedule', label: '계획준수' },
  { key: 'achieveTypeIntensive', label: '단기집중' },
  { key: 'achieveTypeHabit', label: '습관기반' },
  { key: 'achieveTypeRole', label: '역할분담' },
] as const

export const FAIL_TYPES = [
  { key: 'goal_error', label: '목표설정 오류' },
  { key: 'no_plan', label: '계획부재' },
  { key: 'lack_execution', label: '실행력 부족' },
  { key: 'poor_mgmt', label: '점검관리 미흡' },
  { key: 'env_fail', label: '환경변수 대응실패' },
  { key: 'communication', label: '소통단절' },
] as const

export const FAIL_DETAILS = [
  { key: 'failDetailGoalVague', group: 'goal_error', label: '목표모호' },
  { key: 'failDetailGoalUnrealistic', group: 'goal_error', label: '현실성없는목표' },
  { key: 'failDetailGoalPriority', group: 'goal_error', label: '우선순위 불명확' },
  { key: 'failDetailNoSchedule', group: 'no_plan', label: '일정표 없음' },
  { key: 'failDetailNoStepPlan', group: 'no_plan', label: '단계별 실행계획 없음' },
  { key: 'failDetailNoAssignee', group: 'no_plan', label: '담당자 미지정' },
  { key: 'failDetailWorkCondition', group: 'lack_execution', label: '직장여건' },
  { key: 'failDetailTimeShort', group: 'lack_execution', label: '실행시간부족' },
  { key: 'failDetailNoRepeat', group: 'lack_execution', label: '반복실행실패' },
  { key: 'failDetailLostMotivation', group: 'lack_execution', label: '초기의욕 후 급감' },
  { key: 'failDetailPostpone', group: 'lack_execution', label: '다음으로 미룸' },
  { key: 'failDetailNoMidCheck', group: 'poor_mgmt', label: '중간점검안됨' },
  { key: 'failDetailLateResponse', group: 'poor_mgmt', label: '문제발생후대응지연' },
  { key: 'failDetailNoData', group: 'poor_mgmt', label: '데이터분석부재' },
  { key: 'failDetailNoExternal', group: 'env_fail', label: '외부변수고려부족' },
  { key: 'failDetailNoRiskPlan', group: 'env_fail', label: '리스크대비계획없음' },
  { key: 'failDetailNoResource', group: 'env_fail', label: '인력자원부족' },
  { key: 'failDetailRoleDup', group: 'communication', label: '역할중복' },
  { key: 'failDetailGap', group: 'communication', label: '공백' },
  { key: 'failDetailCollapse', group: 'communication', label: '협업붕괴' },
  { key: 'failDetailDelay', group: 'communication', label: '업무지연' },
] as const
