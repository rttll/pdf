class Storage
  require 'google/cloud/storage'
  require 'fileutils'

  def initialize(bucket = 'pdf')
    @project =
      Ellington.credentials[:google][:project_id],
      storage_params = {
        project: @project,
        keyfile: Rails.application.credentials[:google][:storage][:key]
      }
    @storage = Google::Cloud::Storage.new(storage_params)
    @bucket = @storage.bucket bucket
  end

  def upload(source, dest = '')
    up = @bucket.create_file source.to_s, dest
  end

 
end
