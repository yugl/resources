var DomainName = "http://192.168.8.183:8080/"; //测试环境API 

/*========数据接口地址*/
var InterfaceUrl = {
    getModuleByPid: DomainName + "index/getModuleByPid", //获取模块操作权限
    login: DomainName + "api/login", //登陆接口
    authInfo: DomainName + "api/authInfo", //登陆接口
    menuList: DomainName + "index/menuList", //菜单模块
    appList: DomainName + "index/appList", //菜单模块
    productList: DomainName + "goods/goodsList", //商品列表
    delGoods: DomainName + "goods/delGoods", //删除商品
    getGoodsById: DomainName + "goods/getGoodsById", //获取商品详情
    editGoods: DomainName + "goods/editGoods", //编辑商品
    changeStatus: DomainName + "goods/changeStatus", //商品状态修改
    changeTop: DomainName + "goods/changeTop", //商品置顶
    manySale: DomainName + "goods/manySale", //批量上下架
    goodsDepotList: DomainName + "goods/depotList", //商品列表模块中库列表数据
    addGoods: DomainName + "goods/addGoods", //添加商品
    classList: DomainName + "class/classList", //商品分类列表
    getClassById: DomainName + "class/getClassById", //获取商品分类详情
    editClass: DomainName + "class/editClass", //修改商品分类
    delClass: DomainName + "class/delClass", //删除商品分类
    addClass: DomainName + "class/addClass", //添加商品分类 
    uploadFtpServer: DomainName + "depot/uploadFtpServer", //图片ftp上传
    goodsList: DomainName + "depot/goodsList", //商品库列表数据
    addDepotGoods: DomainName + "depot/addGoods", //商品库-添加
    addGoodsByFile: DomainName + "depot/addGoodsByFile", //商品库-从excel中批量导入
    addMultiGoods: DomainName + "depot/addMultiGoods", //商品库批量添加
    getDepotGoodsById: DomainName + "depot/getGoodsById/", //商品库-获取商品详情
    editDepotGoods: DomainName + "depot/editGoods", //商品库-修改
    delDepotGoods: DomainName + "depot/delGoods/"//商品库-删除
}; 
var PayTypeList = [{ id: '1', className: '积分' }, 
        { id: '2', className: '现金' },
        { id: '3', className: '积分+现金' } 
    ];
