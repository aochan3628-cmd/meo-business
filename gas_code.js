// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Blue Life 無料診断フォーム GAS バックエンド
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 
// 【セットアップ手順】
// 1. Google Spreadsheetを新規作成
// 2. 1行目にヘッダーを入力:
//    A1: タイムスタンプ | B1: お名前 | C1: 会社名 | D1: 業種 | E1: メール | F1: 電話 | G1: GoogleマップURL | H1: お悩み | I1: メッセージ
// 3. 拡張機能 → Apps Script を開く
// 4. このコードを貼り付けて保存
// 5. デプロイ → 新しいデプロイ → ウェブアプリ
//    - 次のユーザーとして実行: 自分
//    - アクセスできるユーザー: 全員
// 6. デプロイURLをコピーして contact.html の GAS_URL に貼る
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ★通知先メールアドレス（自分のGmailアドレスに変更）
const NOTIFY_EMAIL = 'YOUR_EMAIL@gmail.com';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // スプレッドシートに記録
    sheet.appendRow([
      new Date(),                    // タイムスタンプ
      data.name || '',               // お名前
      data.company || '',            // 会社名
      data.industry || '',           // 業種
      data.email || '',              // メール
      data.phone || '',              // 電話
      data.google_maps_url || '',    // GoogleマップURL
      data.concerns || '',           // お悩み
      data.message || ''             // メッセージ
    ]);
    
    // メール通知
    var subject = '【Blue Life】無料診断申込: ' + (data.company || '名称なし');
    var body = '━━━━━━━━━━━━━━━━━━━━━━\n'
      + '新しい無料診断の申し込みがありました\n'
      + '━━━━━━━━━━━━━━━━━━━━━━\n\n'
      + '■ お名前: ' + (data.name || '-') + '\n'
      + '■ 会社名: ' + (data.company || '-') + '\n'
      + '■ 業種: ' + (data.industry || '-') + '\n'
      + '■ メール: ' + (data.email || '-') + '\n'
      + '■ 電話: ' + (data.phone || '-') + '\n'
      + '■ GoogleマップURL: ' + (data.google_maps_url || '-') + '\n'
      + '■ お悩み: ' + (data.concerns || '-') + '\n'
      + '■ メッセージ: ' + (data.message || '-') + '\n\n'
      + '━━━━━━━━━━━━━━━━━━━━━━\n'
      + 'スプレッドシートで確認: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body
    });
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用（Apps Scriptエディタで直接実行して動作確認）
function testDoPost() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'テスト太郎',
        company: 'テスト建設',
        industry: 'リフォーム',
        email: 'test@example.com',
        phone: '090-1234-5678',
        google_maps_url: 'https://maps.google.com/test',
        concerns: '口コミへの返信ができていない, 検索順位が低い',
        message: 'テスト送信です'
      })
    }
  };
  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
