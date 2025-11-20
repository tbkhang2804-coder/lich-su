
HƯỚNG DẪN NHANH ĐỂ TRIỂN KHAI LÊN GITHUB PAGES (USERNAME: tbkhang2804-coder)

1) Tạo repository mới trên GitHub (tên repo: lich-su-ai)
   - Vào https://github.com/new
   - Repository name: lich-su-ai
   - Public -> Create repository

2) Trên máy bạn (nơi đã giải nén ZIP), chạy:
   git init
   git add .
   git commit -m "Initial commit - lich-su-ai site"
   git branch -M main
   git remote add origin https://github.com/tbkhang2804-coder/lich-su-ai.git
   git push -u origin main

3) Vào Settings -> Pages -> Build and deployment:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)  OR chọn /docs nếu bạn đặt files vào folder docs
   - Save. GitHub sẽ tạo site ở: https://tbkhang2804-coder.github.io/lich-su-ai/

4) Đợi 1-2 phút, truy cập URL trên để mở trang.

GHI CHÚ:
- Site dùng API Wikipedia để lấy mô tả và ảnh thời gian thực.
- Nếu cần tôi sẽ tạo sẵn repository và hướng dẫn từng bước bằng hình ảnh.
