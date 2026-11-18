// Mail, file-sharing and device lessons: SMTP, POP3, IMAP, FTP, SMB, Modbus.
// Written from the public specifications (RFC 5321, 5322, 1939, 9051, 959;
// Microsoft's open MS-SMB2 specification; the Modbus Application Protocol).
import { ADDR, ascii, hex0x, noise, size, t, u16, u24, type Field, type L, type Layer } from '../packet'
import { LAPTOP, MAIL, MAIL2, NAS, PLC, SERVER, app, at, conversation, f, far, homeTopo, line, send, type Lesson, type NodeDef } from '../net'

const laptopNode = (x: number, y: number, label = t('Laptop', 'ল্যাপটপ')): NodeDef => ({ kind: 'laptop', label, sub: ADDR.laptopIp, at: [x, y] })
/** A one-line command or reply as a packet's application layer. */
const say = (proto: string, text: string, note: L, shown = text): Layer => app(proto, [{ ...line(/^[\d+*-]/.test(text) ? 'Reply' : 'Command', text, note), value: shown }])
const msg = (...lines: [string, string, L][]): Field[] => lines.map(([name, text, note]) => line(name, text, note))

const mailBody = (received: boolean): Field[] => msg(
  ...(received ? [['Received', 'Received: from mail.example.org by mx.example.com', t('Each server that handles the message adds a line like this at the top. Read from the bottom up, they show the route it took.', 'message সামলানো প্রতিটা server ওপরে এমন একটা লাইন যোগ করে। নিচ থেকে ওপরে পড়লে এগুলো বলে message কোন পথে এসেছে।')] as [string, string, L]] : []),
  ['From', 'From: Alice <alice@example.org>', t('What the reader sees as the sender. Nothing in SMTP itself checks this is true — that is the job of SPF, DKIM and DMARC.', 'পাঠক প্রেরক হিসেবে যা দেখে। SMTP নিজে এটা সত্যি কিনা যাচাই করে না — সে কাজ SPF, DKIM আর DMARC-এর।')],
  ['To', 'To: Bob <bob@example.com>', t('The displayed recipient. Delivery actually follows the RCPT TO command, not this line.', 'দেখানো প্রাপক। delivery আসলে RCPT TO command মেনে হয়, এই লাইন নয়।')],
  ['Subject', 'Subject: Lunch?', t('The subject line.', 'বিষয়ের লাইন।')],
  ['Blank line', '', t('Separates the headers from the body.', 'header আর body আলাদা করে।')],
  ['Body', 'Are you free at one?', t('The message text.', 'message-এর লেখা।')],
)

// ═══ SMTP ═══════════════════════════════════════════════════════════════
const submit = conversation(LAPTOP, MAIL, 587)
const relay = conversation(MAIL, MAIL2, 25, 40025)

const smtp: Lesson = {
  id: 'smtp',
  name: 'SMTP',
  category: 'files',
  tagline: t('How email is sent', 'email যেভাবে পাঠানো হয়'),
  intro: t('SMTP moves a message from your mail app to your provider, and from your provider to the recipient’s. It is a plain-text conversation of short commands and numbered replies — you could type it by hand.', 'SMTP একটা message-কে আপনার mail app থেকে আপনার provider-এর কাছে, আর সেখান থেকে প্রাপকের provider-এর কাছে পৌঁছে দেয়। এটা ছোট command আর নম্বর দেওয়া উত্তরের একটা plain-text কথোপকথন — হাতে টাইপ করেও করা যায়।'),
  topo: homeTopo({
    mail: far(t('Your mail server', 'আপনার mail server'), 'mail.example.org', 'mail', 'up'),
    mail2: far(t('Bob’s mail server', 'Bob-এর mail server'), 'mx.example.com', 'mail'),
  }),
  steps: [
    send('mail', 'laptop', '220 ready', t('The server speaks first', 'server আগে কথা বলে'), t('You press Send. The mail app connects to port 587 and waits for the greeting.', 'আপনি Send টিপলেন। mail app port 587-এ connect করে সম্ভাষণের অপেক্ষা করে।'), submit.reply(say('SMTP', '220 mail.example.org ESMTP ready', t('2xx means success. 220 = service ready.', '2xx মানে সফল। 220 = service প্রস্তুত।')))),
    send('laptop', 'mail', 'EHLO', t('EHLO — introductions', 'EHLO — পরিচয়'), t('The client names itself. The server answers with the features it supports; the two then switch to encryption (STARTTLS) and the app logs in. Those steps are left out here.', 'client নিজের নাম বলে। server তার সমর্থিত feature জানায়; তারপর দুপক্ষ encryption-এ যায় (STARTTLS) আর app login করে। ওই ধাপগুলো এখানে বাদ।'), submit.send(say('SMTP', 'EHLO laptop.local', t('"Extended hello" — also asks which extensions the server offers.', '"Extended hello" — server কী কী extension দেয় তাও জানতে চায়।')))),
    send('laptop', 'mail', 'MAIL FROM', t('MAIL FROM — the envelope sender', 'MAIL FROM — খামের প্রেরক'), t('Like a paper letter, an email has an envelope separate from the letter inside. This is the return address on the envelope.', 'কাগজের চিঠির মতো email-এরও ভেতরের চিঠি থেকে আলাদা একটা খাম আছে। এটা খামের ওপরের ফেরত-ঠিকানা।'), submit.send(say('SMTP', 'MAIL FROM:<alice@example.org>', t('Where bounce messages go if delivery fails.', 'delivery ব্যর্থ হলে bounce message কোথায় যাবে।')))),
    send('laptop', 'mail', 'RCPT TO', t('RCPT TO — the envelope recipient', 'RCPT TO — খামের প্রাপক'), t('One command per recipient. This is how Bcc works: the address is on the envelope but never written in the letter.', 'প্রতি প্রাপকের জন্য একটা command। Bcc এভাবেই কাজ করে: ঠিকানা খামে থাকে কিন্তু চিঠিতে লেখা হয় না।'), submit.send(say('SMTP', 'RCPT TO:<bob@example.com>', t('Who the message is actually delivered to.', 'message আসলে কার কাছে পৌঁছবে।')))),
    send('laptop', 'mail', 'DATA + message', t('DATA — the letter itself', 'DATA — আসল চিঠি'), t('After the server says "354 go ahead", the client sends the headers, a blank line and the body, then a line containing only a full stop.', 'server "354 go ahead" বলার পর client পাঠায় header, একটা ফাঁকা লাইন আর body, তারপর শুধু একটা দাঁড়ি-বিন্দু (.) থাকা লাইন।'), submit.send(app('SMTP message', [...mailBody(false), line('End of data', '.', t('A full stop alone on a line ends the message.', 'একটা লাইনে শুধু একটা বিন্দু message শেষ করে।'))]))),
    send('mail', 'laptop', '250 queued', t('Accepted', 'গৃহীত'), t('The server now owns the message. Your app can close the connection — delivery continues without you.', 'message-এর দায়িত্ব এখন server-এর। আপনার app connection বন্ধ করতে পারে — delivery আপনাকে ছাড়াই চলবে।'), submit.reply(say('SMTP', '250 2.0.0 OK: queued as 4F2A91', t('250 = requested action completed.', '250 = চাওয়া কাজ সম্পূর্ণ।')))),
    at('mail', t('Where does example.com receive mail?', 'example.com কোথায় mail নেয়?'), t('The server asks DNS for the MX record of example.com. The answer names the recipient’s mail server.', 'server DNS-কে example.com-এর MX record জিজ্ঞেস করে। উত্তরে প্রাপকের mail server-এর নাম থাকে।')),
    send('mail', 'mail2', 'Server-to-server SMTP', t('The same conversation, server to server', 'একই কথোপকথন, server থেকে server'), t('Your provider repeats EHLO, MAIL FROM, RCPT TO and DATA with Bob’s server on port 25. Notice the new Received line at the top.', 'আপনার provider Bob-এর server-এর সঙ্গে port 25-এ EHLO, MAIL FROM, RCPT TO আর DATA আবার করে। ওপরে নতুন Received লাইনটা লক্ষ করুন।'), relay.send(app('SMTP message', [...mailBody(true), line('End of data', '.', t('Ends the message.', 'message শেষ করে।'))]))),
    at('mail2', t('Delivered to the mailbox', 'mailbox-এ পৌঁছে গেল'), t('Bob’s server checks the message for spam and forgery, then stores it. SMTP’s work is done — Bob reads it using IMAP or POP3.', 'Bob-এর server message-টা spam আর জালিয়াতির জন্য পরীক্ষা করে, তারপর রেখে দেয়। SMTP-র কাজ শেষ — Bob এটা পড়ে IMAP বা POP3 দিয়ে।')),
  ],
}

// ═══ POP3 ═══════════════════════════════════════════════════════════════
const pop = conversation(LAPTOP, MAIL2, 110)
const secret = t('The password, sent as plain text. Real mail apps wrap the whole conversation in TLS (port 995) so nobody on the path can read it.', 'password, সাদা text-এ পাঠানো। আসল mail app পুরো কথোপকথন TLS-এ মোড়ে (port 995), যাতে পথের কেউ পড়তে না পারে।')

const pop3: Lesson = {
  id: 'pop3',
  name: 'POP3',
  category: 'files',
  tagline: t('Download mail, then delete it', 'mail নামাও, তারপর মুছে দাও'),
  intro: t('POP3 treats the server as a post box: collect what is there, take it home, empty the box. It is simple and suits one device — but mail read on your laptop is then missing from your phone.', 'POP3 server-কে ডাকবাক্স হিসেবে দেখে: যা আছে তুলে নাও, বাড়ি নিয়ে যাও, বাক্স খালি করো। সহজ আর এক ডিভাইসের জন্য ঠিক — কিন্তু ল্যাপটপে পড়া mail তখন phone-এ থাকে না।'),
  topo: homeTopo({ mail: far(t('Mail server', 'Mail server'), 'mx.example.com', 'mail') }),
  steps: [
    send('mail', 'laptop', '+OK ready', t('Greeting', 'সম্ভাষণ'), t('Every POP3 reply starts with +OK or -ERR.', 'প্রতিটা POP3 উত্তর +OK বা -ERR দিয়ে শুরু।'), pop.reply(say('POP3', '+OK POP3 server ready', t('+OK = success.', '+OK = সফল।')))),
    send('laptop', 'mail', 'USER bob', t('USER', 'USER'), t('The mailbox name.', 'mailbox-এর নাম।'), pop.send(say('POP3', 'USER bob', t('Which mailbox to open.', 'কোন mailbox খুলতে হবে।')))),
    send('laptop', 'mail', 'PASS ••••', t('PASS', 'PASS'), t('The password follows.', 'এরপর password।'), pop.send(say('POP3', 'PASS hunter2', secret, 'PASS ••••••'))),
    send('mail', 'laptop', '+OK 2 messages', t('Logged in', 'login হল'), t('The server locks the mailbox for this session and reports what is waiting.', 'server এই session-এর জন্য mailbox lock করে আর জানায় কী অপেক্ষা করছে।'), pop.reply(say('POP3', '+OK bob has 2 messages (640 octets)', t('Two messages, 640 bytes in total.', 'দুটো message, মোট 640 bytes।')))),
    send('laptop', 'mail', 'RETR 1', t('RETR — fetch message 1', 'RETR — 1 নম্বর message আনো'), t('Messages are simply numbered 1, 2, 3 for this session.', 'এই session-এ message-গুলোর নম্বর শুধু 1, 2, 3।'), pop.send(say('POP3', 'RETR 1', t('Retrieve the whole message.', 'পুরো message আনো।')))),
    send('mail', 'laptop', 'The message', t('The message arrives', 'message পৌঁছল'), t('Headers, blank line, body, and a lone full stop to end — the same format SMTP delivered.', 'Header, ফাঁকা লাইন, body, আর শেষে একলা একটা বিন্দু — SMTP যে format-এ পৌঁছে দিয়েছিল সেটাই।'), pop.reply(app('POP3 message', [line('Reply', '+OK 320 octets', t('The message follows.', 'এরপর message।')), ...mailBody(true), line('End of data', '.', t('Ends the message.', 'message শেষ করে।'))]))),
    send('laptop', 'mail', 'DELE 1', t('DELE — remove it from the server', 'DELE — server থেকে মুছে দাও'), t('The classic POP3 habit: once downloaded, delete the server’s copy. The only copy is now on this laptop.', 'POP3-র পুরনো অভ্যাস: নামানো হলে server-এর copy মুছে দাও। একমাত্র copy এখন এই ল্যাপটপে।'), pop.send(say('POP3', 'DELE 1', t('Marks the message for deletion.', 'message-টা মোছার জন্য চিহ্নিত করে।')))),
    send('laptop', 'mail', 'QUIT', t('QUIT', 'QUIT'), t('Only now does the server really delete the marked messages and release the mailbox.', 'শুধু এবারই server চিহ্নিত message সত্যিই মোছে আর mailbox ছেড়ে দেয়।'), pop.send(say('POP3', 'QUIT', t('Ends the session and applies the deletions.', 'session শেষ করে আর মোছাগুলো কার্যকর করে।')))),
  ],
}

// ═══ IMAP ═══════════════════════════════════════════════════════════════
const imap = conversation(LAPTOP, MAIL2, 143)
const tagNote = t('Every command starts with a tag chosen by the client; the final reply repeats it. That lets a client send several commands without waiting.', 'প্রতিটা command শুরু হয় client-এর বেছে নেওয়া একটা tag দিয়ে; চূড়ান্ত উত্তরে সেটা ফেরে। এতে client অপেক্ষা না করেই একাধিক command পাঠাতে পারে।')

const imapLesson: Lesson = {
  id: 'imap',
  name: 'IMAP',
  category: 'files',
  tagline: t('Mail that stays in sync everywhere', 'সব জায়গায় মিলে থাকা mail'),
  intro: t('With IMAP the mail lives on the server and every device is a window onto it. Read a message on your phone and it shows as read on your laptop. That takes a richer protocol than POP3.', 'IMAP-এ mail থাকে server-এ, আর প্রতিটা ডিভাইস তার একটা জানালা। phone-এ একটা message পড়লে ল্যাপটপেও সেটা পড়া দেখায়। এর জন্য POP3-র চেয়ে সমৃদ্ধ protocol লাগে।'),
  topo: homeTopo({ mail: far(t('Mail server', 'Mail server'), 'mx.example.com', 'mail') }),
  steps: [
    send('laptop', 'mail', 'a1 LOGIN', t('LOGIN', 'LOGIN'), t('After the server’s greeting the client logs in.', 'server-এর সম্ভাষণের পর client login করে।'), imap.send(say('IMAP', 'a1 LOGIN bob hunter2', tagNote, 'a1 LOGIN bob ••••••'))),
    send('laptop', 'mail', 'a2 SELECT INBOX', t('SELECT — open a folder', 'SELECT — একটা folder খোলো'), t('IMAP has folders, and they live on the server.', 'IMAP-এ folder আছে, আর সেগুলো server-এ থাকে।'), imap.send(say('IMAP', 'a2 SELECT INBOX', t('Opens the inbox.', 'inbox খোলে।')))),
    send('mail', 'laptop', '* 2 EXISTS', t('The folder’s state', 'folder-এর অবস্থা'), t('Lines starting with * are information the server volunteers. The line starting with the tag closes the command.', '* দিয়ে শুরু লাইন server-এর নিজে থেকে দেওয়া তথ্য। tag দিয়ে শুরু লাইন command শেষ করে।'), imap.reply(app('IMAP', msg(
      ['Reply', '* 2 EXISTS', t('Two messages in this folder.', 'এই folder-এ দুটো message।')],
      ['Reply', '* FLAGS (\\Seen \\Answered \\Flagged \\Deleted)', t('The marks a message can carry. These are stored on the server — that is what keeps devices in sync.', 'message-এ যে চিহ্ন থাকতে পারে। এগুলো server-এ রাখা হয় — এতেই ডিভাইসগুলো মিলে থাকে।')],
      ['Reply', 'a2 OK [READ-WRITE] SELECT completed', t('The tagged reply: command a2 is finished.', 'tag-সহ উত্তর: a2 command শেষ।')],
    )))),
    send('laptop', 'mail', 'a3 FETCH', t('FETCH — only what is needed', 'FETCH — শুধু যা দরকার'), t('To draw the message list the client asks for just two headers of message 1, not the whole thing. On a slow connection this matters.', 'message তালিকা আঁকতে client 1 নম্বর message-এর শুধু দুটো header চায়, পুরোটা নয়। ধীর connection-এ এটা কাজে দেয়।'), imap.send(say('IMAP', 'a3 FETCH 1 (BODY[HEADER.FIELDS (FROM SUBJECT)])', t('Fetch part of a message.', 'message-এর একটা অংশ আনো।')))),
    send('mail', 'laptop', 'Two headers', t('Just those two lines', 'শুধু ওই দুটো লাইন'), t('An attachment is not downloaded until you open it.', 'attachment আপনি না খোলা পর্যন্ত নামানো হয় না।'), imap.reply(app('IMAP', msg(
      ['Reply', '* 1 FETCH (BODY[HEADER.FIELDS (FROM SUBJECT)] {52}', t('{52} announces that 52 bytes of raw data follow.', '{52} জানায় এরপর 52 byte কাঁচা data আসছে।')],
      ['From', 'From: Alice <alice@example.org>', t('The sender header.', 'প্রেরকের header।')],
      ['Subject', 'Subject: Lunch?', t('The subject header.', 'বিষয়ের header।')],
      ['Blank line', '', t('Ends the header block.', 'header block শেষ করে।')],
      ['Reply', ')', t('Closes the FETCH data.', 'FETCH data বন্ধ করে।')],
      ['Reply', 'a3 OK FETCH completed', t('Command a3 is finished.', 'a3 command শেষ।')],
    )))),
    send('laptop', 'mail', 'a4 STORE +FLAGS \\Seen', t('STORE — mark as read', 'STORE — পড়া হিসেবে চিহ্নিত করো'), t('You open the message. The "read" mark is saved on the server, so your phone shows it as read too.', 'আপনি message খুললেন। "পড়া" চিহ্ন server-এ রাখা হয়, তাই আপনার phone-ও সেটা পড়া দেখায়।'), imap.send(say('IMAP', 'a4 STORE 1 +FLAGS (\\Seen)', t('Adds the \\Seen flag to message 1.', '1 নম্বর message-এ \\Seen flag যোগ করে।')))),
    send('mail', 'laptop', '* 3 EXISTS', t('IDLE — new mail, pushed', 'IDLE — নতুন mail, ঠেলে পাঠানো'), t('The client sent IDLE and left the connection open. When a new message lands, the server says so at once — no polling.', 'client IDLE পাঠিয়ে connection খোলা রেখেছে। নতুন message এলে server সঙ্গে সঙ্গে জানায় — বারবার জিজ্ঞেস করতে হয় না।'), imap.reply(say('IMAP', '* 3 EXISTS', t('The folder now holds three messages.', 'folder-এ এখন তিনটে message।')))),
  ],
}

// ═══ FTP ════════════════════════════════════════════════════════════════
const ftp = conversation(LAPTOP, SERVER, 21)
const ftpData = conversation(LAPTOP, SERVER, 50000, 51010)

const ftpLesson: Lesson = {
  id: 'ftp',
  name: 'FTP',
  category: 'files',
  tagline: t('File transfer on two connections', 'দুটো connection-এ file transfer'),
  intro: t('FTP is one of the oldest internet protocols still in use. Its odd feature: commands travel on one connection and file contents on a second. It has no encryption — SFTP and FTPS exist to fix that.', 'FTP এখনও চালু থাকা সবচেয়ে পুরনো internet protocol-গুলোর একটা। এর অদ্ভুত বৈশিষ্ট্য: command যায় এক connection-এ আর file-এর বিষয়বস্তু আরেকটায়। এতে encryption নেই — সেটা ঠিক করতেই SFTP আর FTPS।'),
  topo: homeTopo({ server: far(t('FTP server', 'FTP server'), 'files.example.com', 'files') }),
  steps: [
    send('server', 'laptop', '220 ready', t('Greeting on the control connection', 'control connection-এ সম্ভাষণ'), t('The client connected to port 21. This connection carries only commands and replies.', 'client port 21-এ connect করেছে। এই connection শুধু command আর উত্তর বহন করে।'), ftp.reply(say('FTP', '220 FTP server ready', t('220 = ready for a new user.', '220 = নতুন ব্যবহারকারীর জন্য প্রস্তুত।')))),
    send('laptop', 'server', 'USER / PASS', t('Logging in', 'login'), t('Username, then password, both readable by anyone on the path.', 'username, তারপর password, দুটোই পথের যে কেউ পড়তে পারে।'), ftp.send(app('FTP', [
      line('Command', 'USER alice', t('The username.', 'username।')),
      { ...line('Command', 'PASS hunter2', t('The password in plain text. This alone is reason enough not to use plain FTP on the internet.', 'সাদা text-এ password। internet-এ সাদা FTP ব্যবহার না করার জন্য এটুকুই যথেষ্ট কারণ।')), value: 'PASS ••••••' },
    ]))),
    send('laptop', 'server', 'PASV', t('PASV — "Where shall I connect for data?"', 'PASV — "data-র জন্য কোথায় connect করব?"'), t('In passive mode the client asks the server to open a port and wait. This works through home routers; the older "active" mode, where the server connects back, usually does not.', 'passive mode-এ client server-কে একটা port খুলে অপেক্ষা করতে বলে। এটা বাড়ির router পেরিয়ে চলে; পুরনো "active" mode, যেখানে server পাল্টা connect করে, সাধারণত চলে না।'), ftp.send(say('FTP', 'PASV', t('Enter passive mode.', 'passive mode-এ যাও।')))),
    send('server', 'laptop', '227 (…,195,80)', t('The server names a port', 'server একটা port জানাল'), t('Six numbers: four for the IP address and two for the port. 195 × 256 + 80 = port 50000.', 'ছয়টা সংখ্যা: চারটে IP address-এর আর দুটো port-এর। 195 × 256 + 80 = port 50000।'), ftp.reply(say('FTP', '227 Entering Passive Mode (93,184,216,34,195,80)', t('The address and port to connect to for the data.', 'data-র জন্য যে address আর port-এ connect করতে হবে।')))),
    send('laptop', 'server', 'RETR report.pdf', t('RETR — ask for the file', 'RETR — file চাও'), t('The client opens a second TCP connection to port 50000, then asks for the file on the control connection.', 'client port 50000-এ দ্বিতীয় একটা TCP connection খোলে, তারপর control connection-এ file চায়।'), ftp.send(say('FTP', 'RETR report.pdf', t('Retrieve this file.', 'এই file-টা আনো।')))),
    send('server', 'laptop', 'File bytes', t('The file, on the data connection', 'file, data connection-এ'), t('Look at the TCP ports: 50000, not 21. Raw file bytes with no framing at all — the end of the file is signalled by closing the connection.', 'TCP port দেখুন: 50000, 21 নয়। কোনো মোড়ক ছাড়াই কাঁচা file byte — connection বন্ধ করেই file-এর শেষ জানানো হয়।'), ftpData.reply(app('FTP data', [f('File contents', '%PDF-1.7 …', [...ascii('%PDF-1.7\n'), ...noise(40, 111)], t('The start of the PDF. Shortened here.', 'PDF-এর শুরু। এখানে ছোট করা।'))]))),
    send('server', 'laptop', '226 complete', t('Done, back on the control connection', 'শেষ, আবার control connection-এ'), t('The data connection has closed. The control connection stays open for the next command.', 'data connection বন্ধ হয়ে গেছে। control connection পরের command-এর জন্য খোলা থাকে।'), ftp.reply(say('FTP', '226 Transfer complete', t('226 = file action successful, data connection closed.', '226 = file-এর কাজ সফল, data connection বন্ধ।')))),
  ],
}

// ═══ SMB ════════════════════════════════════════════════════════════════
const smbTalk = conversation(LAPTOP, NAS, 445)
const le = (n: number, bytes: number) => Array.from({ length: bytes }, (_, i) => Math.floor(n / 256 ** i) & 0xff)
const utf16 = (s: string) => Array.from(s).flatMap((c) => [c.charCodeAt(0) & 0xff, c.charCodeAt(0) >> 8])

function smb2(name: string, command: number, commandName: string, response: boolean, messageId: number, treeId: number, body: Field[]): Layer {
  const sessionId = command === 0 ? 0 : 0x1a2b3c4d
  const header: Field[] = [
    f('Protocol ID', '0xfe "SMB"', [0xfe, ...ascii('SMB')], t('Marks SMB version 2 or 3. (Version 1 used 0xff here.)', 'SMB version 2 বা 3 বোঝায়। (Version 1 এখানে 0xff ব্যবহার করত।)')),
    f('Header size', '64 bytes', le(64, 2), t('The SMB2 header is always 64 bytes. SMB fields are little-endian.', 'SMB2 header সবসময় 64 bytes। SMB field little-endian।')),
    f('Credit charge + status', response ? 'success' : '—', [...le(1, 2), ...le(0, 4)], t('Status is the result code in a response; 0 means success.', 'উত্তরে status হল ফলাফলের code; 0 মানে সফল।')),
    f('Command', `${commandName} (${command})`, le(command, 2), t('Which operation: 0 negotiate, 1 session setup, 3 tree connect, 5 create (open), 8 read.', 'কোন কাজ: 0 negotiate, 1 session setup, 3 tree connect, 5 create (খোলা), 8 read।')),
    f('Credits', '1', le(1, 2), t('How many more requests the client may send at once — the server’s flow control.', 'client একসঙ্গে আর কটা request পাঠাতে পারে — server-এর flow control।')),
    f('Flags', response ? 'response' : 'request', le(response ? 1 : 0, 4), t('Bit 0 set = this is a response.', 'Bit 0 সেট = এটা একটা উত্তর।')),
    f('Next command + message ID', `message ${messageId}`, [...le(0, 4), ...le(messageId, 8)], t('The message ID pairs each response with its request.', 'message ID প্রতিটা উত্তরকে তার request-এর সঙ্গে জোড়ে।')),
    f('Process ID + tree ID', treeId ? `tree ${treeId}` : '—', [...le(0, 4), ...le(treeId, 4)], t('The tree ID names the shared folder you are connected to.', 'tree ID বলে আপনি কোন shared folder-এ যুক্ত।')),
    f('Session ID', sessionId ? hex0x(sessionId, 8) : '0 (not logged in yet)', le(sessionId, 8), t('Identifies your logged-in session.', 'আপনার login করা session চিহ্নিত করে।')),
    f('Signature', '16 bytes', new Array<number>(16).fill(0), t('A keyed checksum of the message, once signing is on. Zero here.', 'signing চালু হলে message-এর একটা keyed checksum। এখানে শূন্য।')),
  ]
  const n = size(header) + size(body)
  return app(name, [
    f('Transport header', `${n} bytes follow`, [0, ...u24(n)], t('Four bytes in front of every SMB message on TCP: a zero, then the message length.', 'TCP-তে প্রতিটা SMB message-এর সামনে চার byte: একটা শূন্য, তারপর message-এর দৈর্ঘ্য।')),
    ...header,
    ...body,
  ])
}
const cut = t('Simplified: the real message has more fixed fields around this.', 'সরল করা: আসল message-এ এর চারপাশে আরও নির্দিষ্ট field থাকে।')

const smb: Lesson = {
  id: 'smb',
  name: 'SMB',
  category: 'files',
  tagline: t('Shared folders on a local network', 'লোকাল নেটওয়ার্কে shared folder'),
  intro: t('SMB is what happens when you open a shared folder on another computer or a NAS. Unlike FTP it works on parts of files — a program can open a file on the server and read or change just a piece of it.', 'অন্য কম্পিউটার বা NAS-এর shared folder খুললে যা ঘটে তা-ই SMB। FTP-র মতো নয়, এটা file-এর অংশ নিয়ে কাজ করে — একটা program server-এর file খুলে শুধু একটা টুকরো পড়তে বা বদলাতে পারে।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2.4),
      switch: { kind: 'switch', label: t('Switch', 'Switch'), at: [2.4, 2.4] },
      nas: { kind: 'server', label: t('NAS', 'NAS'), sub: NAS.ip, at: [4.8, 2.4], badge: 'files' },
    },
    links: [['laptop', 'switch'], ['switch', 'nas']],
  },
  steps: [
    at('laptop', t('You open \\\\NAS\\photos', 'আপনি \\\\NAS\\photos খুললেন'), t('The file manager connects to TCP port 445 on the NAS.', 'file manager NAS-এর TCP port 445-এ connect করে।')),
    send('laptop', 'nas', 'Negotiate', t('Negotiate — pick a version', 'Negotiate — একটা version বাছো'), t('The client lists the SMB versions it speaks.', 'client জানায় সে SMB-র কোন কোন version বলে।'), smbTalk.send(smb2('SMB2 Negotiate', 0, 'negotiate', false, 0, 0, [f('Dialects offered', '2.0.2, 2.1, 3.0, 3.1.1', [0x0202, 0x0210, 0x0300, 0x0311].flatMap((d) => le(d, 2)), cut)]))),
    send('nas', 'laptop', 'Negotiate response', t('The server picks the newest', 'server সবচেয়ে নতুনটা বাছে'), t('3.1.1, which can encrypt and sign everything.', '3.1.1, যা সবকিছু encrypt আর sign করতে পারে।'), smbTalk.reply(smb2('SMB2 Negotiate response', 0, 'negotiate', true, 0, 0, [f('Dialect chosen', '3.1.1', le(0x0311, 2), cut)]))),
    send('laptop', 'nas', 'Session setup', t('Session setup — log in', 'Session setup — login'), t('The client proves who it is with a challenge-and-response exchange. The password is never sent.', 'client challenge-and-response আদানপ্রদানে নিজের পরিচয় প্রমাণ করে। password কখনও পাঠানো হয় না।'), smbTalk.send(smb2('SMB2 Session Setup', 1, 'session setup', false, 1, 0, [f('Security blob', 'authentication token', noise(32, 121), t('An NTLM or Kerberos token. Shortened here; it takes two round trips.', 'একটা NTLM বা Kerberos token। এখানে ছোট করা; এতে দুটো round trip লাগে।'))]))),
    send('laptop', 'nas', 'Tree connect', t('Tree connect — choose the share', 'Tree connect — share বাছো'), t('"Tree" is SMB’s word for a shared folder.', 'SMB-র ভাষায় shared folder হল "tree"।'), smbTalk.send(smb2('SMB2 Tree Connect', 3, 'tree connect', false, 2, 0, [f('Path', '\\\\NAS\\photos', utf16('\\\\NAS\\photos'), t('The share’s name in UTF-16: two bytes per character, low byte first.', 'UTF-16-এ share-এর নাম: প্রতি অক্ষরে দুই byte, ছোট byte আগে।'))]))),
    send('laptop', 'nas', 'Create beach.jpg', t('Create — open a file', 'Create — একটা file খোলো'), t('Despite the name, "create" also opens existing files. The server replies with a file handle to use from now on.', 'নাম যা-ই হোক, "create" আগে থেকে থাকা file-ও খোলে। server একটা file handle ফেরত দেয়, এখন থেকে সেটাই ব্যবহার হবে।'), smbTalk.send(smb2('SMB2 Create', 5, 'create', false, 3, 5, [f('File name', 'beach.jpg', utf16('beach.jpg'), cut)]))),
    send('laptop', 'nas', 'Read', t('Read — ask for a range', 'Read — একটা অংশ চাও'), t('"64 KB starting at byte 0." A photo viewer can ask for just the part it needs.', '"0 নম্বর byte থেকে 64 KB।" ছবি দেখার program শুধু দরকারি অংশটুকুই চাইতে পারে।'), smbTalk.send(smb2('SMB2 Read', 8, 'read', false, 4, 5, [
      f('Length', '65536 bytes', le(65536, 4), t('How much to read.', 'কতটা পড়তে হবে।')),
      f('Offset', '0', le(0, 8), t('Where in the file to start.', 'file-এর কোথা থেকে শুরু।')),
    ]))),
    send('nas', 'laptop', 'Read response', t('The data comes back', 'data ফিরে এল'), t('The first bytes of the JPEG. Larger files are read in many such requests, several at once.', 'JPEG-এর প্রথম byte-গুলো। বড় file এমন অনেক request-এ পড়া হয়, একসঙ্গে কয়েকটা।'), smbTalk.reply(smb2('SMB2 Read response', 8, 'read', true, 4, 5, [f('Data', 'JPEG bytes', [0xff, 0xd8, 0xff, 0xe0, ...noise(36, 122)], t('File contents, starting with the JPEG signature ff d8 ff. Shortened here.', 'file-এর বিষয়বস্তু, JPEG signature ff d8 ff দিয়ে শুরু। এখানে ছোট করা।'))]))),
  ],
}

// ═══ Modbus ═════════════════════════════════════════════════════════════
const modbus = conversation(LAPTOP, PLC, 502)

function mb(name: string, txn: number, pdu: Field[]): Layer {
  return app(name, [
    f('Transaction ID', String(txn), u16(txn), t('Matches a response to its request.', 'উত্তরকে তার request-এর সঙ্গে মেলায়।')),
    f('Protocol ID', '0 (Modbus)', u16(0), t('Always zero for Modbus.', 'Modbus-এর জন্য সবসময় শূন্য।')),
    f('Length', `${size(pdu) + 1} bytes`, u16(size(pdu) + 1), t('Bytes that follow, including the unit ID.', 'পরের byte-এর সংখ্যা, unit ID-সহ।')),
    f('Unit ID', '1', [1], t('Which device, when several sit behind one gateway on a serial line.', 'কোন ডিভাইস, যখন একটা gateway-র পেছনে serial line-এ একাধিক থাকে।')),
    ...pdu,
  ])
}
const fn = (code: number, what: string): Field => f('Function code', `${code > 0x80 ? hex0x(code, 2) : code} (${what})`, [code], t('What to do. 3 = read holding registers, 5 = write one coil. A response with the top bit set (0x80 added) is an error.', 'কী করতে হবে। 3 = holding register পড়া, 5 = একটা coil লেখা। সবচেয়ে ওপরের bit সেট (0x80 যোগ) থাকা উত্তর মানে error।'))

const modbusLesson: Lesson = {
  id: 'modbus',
  name: 'Modbus',
  category: 'files',
  tagline: t('How machines in a factory are read', 'কারখানার যন্ত্র যেভাবে পড়া হয়'),
  intro: t('Modbus dates from 1979 and still runs pumps, meters and production lines. A device is just a table of numbered values: registers hold numbers such as a temperature, coils are on/off switches. A controller reads and writes them.', 'Modbus 1979 সালের, আর এখনও pump, meter আর production line চালায়। একটা ডিভাইস শুধু নম্বর দেওয়া মানের একটা table: register-এ তাপমাত্রার মতো সংখ্যা থাকে, coil হল on/off switch। একটা controller সেগুলো পড়ে আর লেখে।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2.4, t('Control PC', 'Control PC')),
      switch: { kind: 'switch', label: t('Switch', 'Switch'), at: [2.4, 2.4] },
      plc: { kind: 'box', label: t('Pump controller', 'Pump controller'), sub: PLC.ip, at: [4.8, 2.4], badge: 'chip' },
    },
    links: [['laptop', 'switch'], ['switch', 'plc']],
  },
  steps: [
    send('laptop', 'plc', 'Read registers 100–101', t('Read two registers', 'দুটো register পড়ো'), t('The control PC asks for the tank temperature and level.', 'control PC tank-এর তাপমাত্রা আর level জানতে চায়।'), modbus.send(mb('Modbus request', 1, [
      fn(3, 'read holding registers'),
      f('Starting address', '100', u16(100), t('The first register wanted.', 'প্রথম যে register চাই।')),
      f('Quantity', '2', u16(2), t('How many registers.', 'কটা register।')),
    ]))),
    send('plc', 'laptop', '235, 50', t('The values', 'মানগুলো'), t('Two 16-bit numbers. Modbus does not say what they mean — the device manual does: 235 is 23.5 °C, 50 is 50 % full.', 'দুটো 16-bit সংখ্যা। Modbus বলে না এগুলোর মানে কী — সেটা ডিভাইসের manual বলে: 235 মানে 23.5 °C, 50 মানে 50 % ভর্তি।'), modbus.reply(mb('Modbus response', 1, [
      fn(3, 'read holding registers'),
      f('Byte count', '4', [4], t('Bytes of data that follow.', 'পরের data-র byte সংখ্যা।')),
      f('Register 100', '235 (23.5 °C)', u16(235), t('The temperature, in tenths of a degree.', 'তাপমাত্রা, ডিগ্রির দশমাংশে।')),
      f('Register 101', '50 (50 %)', u16(50), t('The tank level.', 'tank-এর level।')),
    ]))),
    send('laptop', 'plc', 'Write coil 10 = ON', t('Switch the pump on', 'pump চালু করো'), t('Writing a coil changes something in the physical world.', 'coil লেখা মানে বাস্তব জগতে কিছু বদলানো।'), modbus.send(mb('Modbus request', 2, [
      fn(5, 'write single coil'),
      f('Coil address', '10', u16(10), t('Which switch.', 'কোন switch।')),
      f('Value', 'ON (0xff00)', u16(0xff00), t('0xff00 = on, 0x0000 = off. No other value is allowed.', '0xff00 = চালু, 0x0000 = বন্ধ। অন্য কোনো মান চলে না।')),
    ]))),
    send('plc', 'laptop', 'Echo', t('Confirmed by echo', 'প্রতিধ্বনি দিয়ে নিশ্চিত'), t('A successful write is answered with an exact copy of the request. The pump starts.', 'সফল write-এর উত্তর হল request-এর অবিকল copy। pump চালু হয়।'), modbus.reply(mb('Modbus response', 2, [
      fn(5, 'write single coil'),
      f('Coil address', '10', u16(10), t('Echoed.', 'প্রতিধ্বনি।')),
      f('Value', 'ON (0xff00)', u16(0xff00), t('Echoed.', 'প্রতিধ্বনি।')),
    ]))),
    send('laptop', 'plc', 'Read register 9999', t('Asking for something that is not there', 'যা নেই তা চাওয়া'), t('The controller has no register 9999.', 'controller-এ 9999 নম্বর register নেই।'), modbus.send(mb('Modbus request', 3, [
      fn(3, 'read holding registers'),
      f('Starting address', '9999', u16(9999), t('An address outside the device’s table.', 'ডিভাইসের table-এর বাইরের একটা address।')),
      f('Quantity', '1', u16(1), t('One register.', 'একটা register।')),
    ]))),
    send('plc', 'laptop', 'Exception 2', t('An exception response', 'একটা exception উত্তর'), t('The function code comes back with 0x80 added, followed by a one-byte reason.', 'function code ফেরে 0x80 যোগ হয়ে, তারপর এক byte কারণ।'), modbus.reply(mb('Modbus exception', 3, [
      fn(0x83, 'error for function 3'),
      f('Exception code', '2 (illegal data address)', [2], t('1 = unknown function, 2 = no such address, 3 = bad value.', '1 = অজানা function, 2 = এমন address নেই, 3 = ভুল মান।')),
    ]))),
    at('plc', t('No lock on the door', 'দরজায় তালা নেই'), t('Notice what was missing: no login, no encryption. The controller obeys anyone who can reach port 502. That was fine on a sealed factory cable in 1979 — today such devices must never be reachable from the internet.', 'লক্ষ করুন কী ছিল না: login নেই, encryption নেই। port 502-এ পৌঁছতে পারা যে কারও কথা controller মানে। 1979-এ কারখানার বদ্ধ তারে সেটা ঠিক ছিল — আজ এমন ডিভাইস কখনও internet থেকে নাগালে থাকা চলবে না।')),
  ],
}

export const FILES_LESSONS: Lesson[] = [smtp, imapLesson, pop3, ftpLesson, smb, modbusLesson]
