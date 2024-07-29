class Pfctype < ActiveHash::Base
  self.data = [
   { id: 1, name: '---' },
   { id: 2, name: 'ローファット' },
   { id: 3, name: 'ケトジェニック' },
   { id: 4, name: 'その他' },
 ]

 include ActiveHash::Associations
  has_many :goals
end