#!/bin/bash
# Script sao lưu CSDL hàng ngày
docker exec security_asset_db /usr/bin/mysqldump -u root --password=rootpassword security_asset_db > backup_$(date +\%F).sql
