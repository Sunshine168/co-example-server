'use strict';

const Service = require('egg').Service;

class PartnerService extends Service {
  create(partner) {
    return this.app.model.Partner.create(partner).exec();
  }
  // 按创建时间降序获取某个用户名下的所有房间
  getRooms(partner) {
    return this.app.model.Partner.find({ partner })
      .populate({
        path: 'room',
        model: 'Room',
      })
      .sort({ _id: -1 })
      .exec();
  }
  // 删除前需要检查权限,待补充
  delPartner(partner) {
    return this.app.model.Partner.remove({ partner }).exec();
  }

  updatePartnerStauts(partnerId, status) {
    return this.app.model.Partner.update(
      {
        _id: partnerId,
      },
      { $set: { status } }
    );
  }
}

module.export = PartnerService;
