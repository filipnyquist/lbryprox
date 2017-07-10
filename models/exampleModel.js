module.exports = mongoose => {
  const schema = new mongoose.Schema({ name: 'string', size: 'string' })
  return mongoose.model('Example', schema)
}
