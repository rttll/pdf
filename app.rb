require 'wicked_pdf'

# include './lib/pdf'

HEADERS = {
    "Access-Control-Allow-Origin" => "*",
    "Access-Control-Allow-Methods" => "GET",
  }

# def options_headers
#   headers = {
#     "Access-Control-Allow-Origin"  => "*",
#     "Access-Control-Allow-Methods" => "GET",
#     "Access-Control-Allow-Headers" => "Content-Type",
#     "Access-Control-Max-Age"       => "3600"
#   }
# end

FunctionsFramework.http "pdf" do |request|

  resp = 'hiii'
  # url = request.params[:url]
  # filename = request.params[:filename]

  # pdf = generate(url, filename)
  # resp = upload(pdf)

  # resp = WickedPdf.new.pdf_from_string('<div>pdf</div>')
  url = 'http://localhost:3000/'
  resp = WickedPdf.new.pdf_from_url(url)

  # File.open('./foo.pdf', 'wb') do |file|
  #   file << resp
  # end

  # send_data pdf, filename: 'file.pdf'
  # resp = pdf

  # if request.options?
  #   return [204, options_headers, []]
  # end


  [ 200, HEADERS, [resp] ]


end