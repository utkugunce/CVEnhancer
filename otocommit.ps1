Write-Host "Otomatik takip baslatildi. Durdurmak icin terminalde CTRL+C yapabilirsin." -ForegroundColor Green

while ($true) {
    # 1. Dosya degisikliklerini ekle
    git add .

    # 2. Commit at (Saat bilgisiyle beraber)
    $date = Get-Date -Format "HH:mm:ss"
    git commit -m "Auto-save: $date"

    # 3. Yolla
    git push

    # 4. 30 saniye bekle
    Start-Sleep -Seconds 30
}