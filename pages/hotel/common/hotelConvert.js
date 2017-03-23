

/**
 * 星级转换
 */
function swichStartType(HotelStarId) {

  switch (HotelStarId.toString()) {
    case "1":
      return "五星级"
      break;
    case "2":
      return "豪华型"
      break;
    case "3":
      return "四星级"
      break;
    case "4":
      return "高档型"
      break;
    case "5":
      return "三星级"
      break;
    case "6":
      return "舒适型"
      break;
    case "11":
      return "经济型"
      break;
    case "7":
      return "二星级"
      break;
    default:
      return "舒适型"
      break;
  }
}

/**
 * 货币类型转换
 */
function switchPriceType(CurrencyId) {

  switch (CurrencyId.toString()) {
    case "1":
      return "￥";
      break;
    case "2":
      return "$";
      break;
    case "3":
      return "HK$";
      break;
    case "11":
      return "MOP$";
      break;
    default:
      return "￥";
      break;
  };
}
/**
 * 早餐转换
 */
function switchBreakfastNum(BreakfastNum) {
  switch (BreakfastNum.toString()) {
    case "0":
      return "不含早";
      break;
    case "1":
      return "单早";
      break;
    case "2":
      return "双早";
      break;
    case "3":
      return "三早";
      break;
    default:
      return "不含早";
      break;
  }
}
/**
 * 宽带转换
 */
function swichWIFI(WIFI) {
  switch (WIFI.toString()) {
    case "0":
      return "不可上网";
      break;
    case "1":
      return "免费宽带";
      break;
    case "2":
      return "收费宽带";
      break;
    case "3":
      return "免费Wifi";
      break;
    case "4":
      return "收费Wifi";
      break;
    default:
      return "不可上网";
      break;
  }
}

//机场 车站
const ListStationAirport2Item = function (arr) {
  arr = arr || [];
  return arr.map(item => {
    return {
      LocationType: 2,
      BaiDuLon: item.BaiDuLon,
      BaiDuLat: item.BaiDuLat,
      name: item.StationAirportName,
      HotelCompanyId: "",
      data: JSON.stringify({
        LocationType: 2,
        BaiDuLon: item.BaiDuLon,
        BaiDuLat: item.BaiDuLat,
        name: item.StationAirportName,
        HotelCompanyId: "",
      })
    }
  });
}

const ListHotelCircle2Item = function (arr) {
  arr = arr || [];
  return arr.map(item => {
    return {
      LocationType: 4,
      LocationId: item.HotelCircleID,
      name: item.HotelCircleName,
      HotelCompanyId: "",
      data: JSON.stringify({
        LocationType: 4,
        LocationId: item.HotelCircleID,
        name: item.HotelCircleName,
        HotelCompanyId: "",
      })
    }
  })
}

const ListHotelGroup2Item = function (arr) {
  arr = arr || [];
  return arr.map(item => {
    return {
      HotelCompanyId: item.GroupId,
      name: item.GroupName,
      data: JSON.stringify({
        LocationType: 1,
        BaiDuLon: item.BaiDuLon,
        BaiDuLat: item.BaiDuLat,
        name: item.GroupName,
        HotelCompanyId: "",
      })
    }
  })
}

const ListCounty2Item = function (arr) {
  arr = arr || [];
  return arr.map(item => {
    return {
      LocationType: 3,
      LocationId: item.CountyId,
      HotelCompanyId: item.GroupId,
      name: item.CountyName,
      data: JSON.stringify({
        LocationType: 3,
        LocationId: item.CountyId,
        HotelCompanyId: item.GroupId,
        name: item.CountyName,
        HotelCompanyId: "",
      })
    }
  })
}


module.exports = {
  //星级图标转换
  swichStartType,
  //货币图标转换
  switchPriceType,
  //早餐转换
  switchBreakfastNum,
  //宽带转换
  swichWIFI,
  //机场 车站
  ListStationAirport2Item,
  ListHotelCircle2Item,
  ListHotelGroup2Item,
  ListCounty2Item
}