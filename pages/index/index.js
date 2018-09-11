//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    message:'start',
    lifeStyle:[{
      name:'我儿子小成成点一下',
      detail:'你爸爸叫你吃鸡',
      info:'吃不吃啊'
      
    },
    ]
  },
  onLoad(){
    this.setData({
      message:'hello world'
    })
  },
  indexDetail(e){
    const {info,detail}=e.currentTarget.dataset;
    wx.showModal({
      title: detail,
      content: info,
      showCancel:false
    })
  },
  gotoUrl(){
    let url='../test/test'
    wx.navigateTo({
      url
    })
  }
})
