def generate(url, filename)
  pdf = WickedPdf.new.pdf_from_url('https://github.com/mileszs/wicked_pdf')
  
  token_props = { user_id: User.admins.first.id, expires_at: Time.zone.now + 10.minutes }
  token = Token.create(token_props)
  args = { 
    host: Config.settings[:urls][:pdf],  
    query: { 
      token: token.key, 
      filename: filename,
      url: url 
    }.to_query
  }
  args.merge!({host: 'localhost', port: '5000'}) if Rails.env.development?

  URI::HTTP.build args
end