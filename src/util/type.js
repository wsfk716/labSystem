const LabTypeList = [
  { value: 1, label: '实验室' },
  { value: 2, label: '教室' }
]
const CollegeTypeList = [
  { value: 1, label: '计算机学院' },
  { value: 2, label: '外国语学院' }
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
