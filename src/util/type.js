const LabTypeList = [
  { value: 1, label: '实验室' },
  { value: 2, label: '教室' },
  { value: 3, label: '会议室' },
  { value: 4, label: '活动中心' },

]
const CollegeTypeList = [
  { value: 1, label: '计算机学院' },
  { value: 2, label: '外国语学院' },
  { value: 3, label: '机械学院' },
  { value: 4, label: '建筑学院' },
  { value: 5, label: '材料学院' },
  { value: 6, label: '生物学院' },
  { value: 7, label: '化学学院' },
  { value: 8, label: '数学学院' },
  { value: 9, label: '物理学院' },
  { value: 10, label: '经济学院' },
  { value: 11, label: '管理学院' },
  { value: 12, label: '法学院' },
  { value: 13, label: '政治学院' },
  { value: 14, label: '历史学院' },
  { value: 15, label: '地理学院' },
  { value: 16, label: '哲学学院' },
  { value: 17, label: '教育学院' },
  { value: 18, label: '文学院' },
  { value: 19, label: '新闻学院' },
  { value: 20, label: '艺术学院' },
  { value: 21, label: '体育学院' },
  { value: 22, label: '音乐学院' },
  { value: 23, label: '美术学院' },
  { value: 24, label: '舞蹈学院' },
  { value: 25, label: '医学院' },
  { value: 26, label: '护理学院' },
  { value: 27, label: '药学院' },
  { value: 28, label: '工学院' },
  { value: 29, label: '农学院' },
  { value: 30, label: '林学院' },
  { value: 31, label: '环境学院' },
  { value: 32, label: '食品学院' },
  { value: 33, label: '水利学院' },
  { value: 34, label: '动物学院' },

]


const  LabColorType = {
  1:"#02909d",
  2:"#eb5c20",
  3:"#a1d4bd",
  4:"#d05667"
}

const CollegesColorType = {
  1:"#fbcb4a",
  2:"#14c145",
  3:"#eedeb0",
  4:"#065279"
}

const ClassType=[
  { value: 1, label: '第一节课' },
  { value: 2, label: '第二节课' },
  { value: 3, label: '第三节课' },
  { value: 4, label: '第四节课' },

]
const Book_state_text = ["审核中","审核通过","审核未通过"]
const Book_state_type = ["warning","success","error"]

const AUDIT = 0;
const APPROVE = 1;
const REJECT = 2;

const ADMIN =1 
const TEACHER =2
export {
  LabTypeList,
  CollegeTypeList,
  LabColorType,
  CollegesColorType,
  ClassType,
  Book_state_text,
  Book_state_type,
  ADMIN,
  TEACHER,
  AUDIT,
  APPROVE,
  REJECT
}
