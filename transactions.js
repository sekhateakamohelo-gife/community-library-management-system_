const router=require('express').Router();
const pool=require('../config/db');
const {auth,adminOnly}=require('../middleware');
async function activeBorrowed(conn,bookId){const [rows]=await conn.query("SELECT COALESCE(SUM(CASE WHEN type='BORROW' THEN quantity WHEN type='RETURN' THEN -quantity ELSE 0 END),0) AS active FROM transactions WHERE book_id=?",[bookId]);return Number(rows[0].active)}
router.get('/',auth,async(req,res)=>{try{const limit=Math.min(Math.max(Number(req.query.limit)||100,1),500);const [transactions]=await pool.query('SELECT t.id,t.type,t.quantity,t.created_at,b.title AS book_title,u.name AS user_name FROM transactions t LEFT JOIN books b ON b.id=t.book_id LEFT JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC LIMIT ?',[limit]);res.json({transactions})}catch(e){res.status(500).json({message:'Could not load transactions.'})}});
router.post('/',auth,adminOnly,async(req,res)=>{
 const {type,book_id,user_id,quantity}=req.body;const qty=Number(quantity);
 if(!['BORROW','RETURN','STOCK'].includes(type)||!book_id||!Number.isInteger(qty)||qty<1)return res.status(400).json({message:'Select a transaction type, book and quantity of at least 1.'});
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [books]=await conn.query('SELECT id,title,quantity FROM books WHERE id=? FOR UPDATE',[book_id]);
  if(!books.length){await conn.rollback();return res.status(404).json({message:'Book not found.'});}
  const b=books[0];const active=await activeBorrowed(conn,book_id);
  if(type==='BORROW'){
   if(!user_id){await conn.rollback();return res.status(400).json({message:'Select a member to borrow this book.'});}
   if(qty>b.quantity-active){await conn.rollback();return res.status(400).json({message:`Only ${b.quantity-active} copies are currently available.`});}
   const [members]=await conn.query("SELECT id FROM users WHERE id=? AND role='MEMBER'",[user_id]);
   if(!members.length){await conn.rollback();return res.status(400).json({message:'Select a valid library member.'});}
  }
  if(type==='RETURN'&&qty>active){await conn.rollback();return res.status(400).json({message:`Only ${active} copies are currently borrowed and available to return.`});}
  if(type==='STOCK')await conn.query('UPDATE books SET quantity=quantity+? WHERE id=?',[qty,book_id]);
  await conn.query('INSERT INTO transactions(type,book_id,user_id,quantity,created_by) VALUES(?,?,?,?,?)',[type,book_id,user_id||null,qty,req.user.id]);
  await conn.commit();res.status(201).json({message:'Transaction recorded successfully.'});
 }catch(e){await conn.rollback();console.error(e);res.status(500).json({message:'Could not record transaction.'});}finally{conn.release();}
});
module.exports=router;
