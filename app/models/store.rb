class Store < ActiveHash::Base
  self.data = [
   { id: 1, name: '---' },
   { id: 2, name: 'コンビニ' },
   { id: 3, name: 'スーパー' },
   { id: 4, name: 'ファミレス' },
   { id: 5, name: '飲食店' },
   { id: 6, name: '料理' },
   { id: 7, name: 'その他' },
 ]

 include ActiveHash::Associations
  has_many :items
end